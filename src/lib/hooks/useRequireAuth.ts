import { UserRole } from "@/types";
import useAuthState from "./useAuthState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useRequireAuth = (allowedRoles: UserRole[]) => {
    const { profile, loading, role } = useAuthState()
    const router = useRouter()

    useEffect(()=> {
        if(loading) return
        if (!profile){
            const isStaff = allowedRoles.includes('employee') || allowedRoles.includes('admin')
            router.push(isStaff ? "/admin/login" : "/login")
            return
        }
        
         if (!allowedRoles.includes(profile.role)){
            switch(profile.role){
                case 'admin':
                case 'employee':
                    router.push('/admin/dashboard')
                    break;
                case 'client':
                    router.push('/dashboard')
                    break;
                default:
                    router.push('/login')
                    break;
            }
         } 
    }, [profile, loading, router, allowedRoles])

    return { profile, loading, role }
}

export default useRequireAuth;
