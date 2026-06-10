import { UserProfile } from "@/types"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

const useAuthState = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setProfile(null)
                setLoading(false)
                return
            }
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid))
                if(!userDoc.exists()){
                    await auth.signOut()
                    setProfile(null)
                    return;
                } 
                const userProfile = { 
                    uid: user.uid,
                    ...userDoc.data()
                } as UserProfile
                setProfile(userProfile)
                setLoading(false)
            }
            catch(error){
                console.error(error)
                setProfile(null)
                setLoading(false)
            }
            finally{
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])
    return { profile, loading, role: profile?.role }
}

export default useAuthState