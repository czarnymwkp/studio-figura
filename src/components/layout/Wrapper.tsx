const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col flex-1 px-4">
            {children}
        </div>
    );
};

export default Wrapper;