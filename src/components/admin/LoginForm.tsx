"use client";
import { FirebaseError } from "firebase/app";
import loginSchema, { LoginFormValues } from "@/lib/validations/auth";

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword} from "firebase/auth";
import { UserProfile } from "@/types";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


const LoginForm = () => {
    const router = useRouter();

    const [firebaseError, setFirebaseError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange"
    });

    const { register, handleSubmit, formState: { errors, isDirty, isValid, isSubmitting } } = form;
    
    const onSubmit = async (data: LoginFormValues) => {
        setFirebaseError('');
        try {
        const userCredentials = await signInWithEmailAndPassword(auth, data.email, data.password);
        const userDoc = await getDoc(doc(db, "users", userCredentials.user.uid));
        if (!userDoc.exists()) {
            setFirebaseError("Brak profilu, skontaktuj się z administratorem");
            await auth.signOut();
            return;
        }

        const profile = userDoc.data() as UserProfile;

        if (profile.role !== "admin" && profile.role !== "employee") {
            setFirebaseError("Brak uprawnień do zalogowania");
            await auth.signOut();
            return;
        }
        router.push("/admin/dashboard");
    } catch (error) {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case "auth/invalid-credential":
                    setFirebaseError("Nieprawidłowy email lub hasło.")
                    break
                case "auth/too-many-requests":
                    setFirebaseError("Zbyt wiele prób logowania. Spróbuj później.")
                    break
                default:
                    setFirebaseError("Wystąpił błąd. Spróbuj ponownie.")
            }
        }
    }  
    }
    return <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="flex flex-col items-center justify-center">
        <img src="/img/logo.png" alt="Logo" width={100} height={100} className="rounded-lg" />
        
        <Label htmlFor="email" className="p-2 text-white">Email</Label>
        <Input id="email" type="email" placeholder="Email" {...register("email")} />
        {errors.email && <span className="text-red-500 p-1">{errors.email.message}</span>}
        <Label htmlFor="password" className="p-2 text-white">Hasło</Label>
        <Input id="password" type="password" placeholder="Hasło" {...register("password")} />
        {errors.password && <span className="text-red-500 p-2">{errors.password.message}</span>}
        {firebaseError && <span className="text-red-500 text-sm">{firebaseError}</span>}
        <Button type="submit" className="p-4 mt-2" disabled={!isDirty || !isValid || isSubmitting}>Zaloguj</Button>
        </div>
    </form>
} 
export default LoginForm