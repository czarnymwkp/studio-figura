import Image from "next/image";

const Navbar = () => {
    return (
        <header className="bg-white text-gray-900">
            <div className="container py-4 flex items-center gap-4">
                <Image src="/img/logo.png" alt="Logo" width={100} height={100} />
                <h1 className="text-2xl font-bold">Studio Figura</h1>
            </div>
        </header>
    );
};

export default Navbar;