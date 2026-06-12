import  forgotpasswordImg from '../assets/forgot-password-illustration.png'

export default function ForgotPassword() {
    return (
        <section className="h-screen flex items-center justify-center">
            <div className="w-[85%] h-[90%] flex items-center justify-center gap-2">
                <div className="w-[50%] h-full flex flex-col items-center">
                    <div className="pt-10 mb-5">
                        <h2 className="text-2xl font-bold text-center my-4">Mot de passe oublié</h2>
                        <p className="text-center mb-4">Simplifiez votre flux de travail et augmentez votre productivité</p>
                    </div>


                    <form className="flex flex-col w-md">
                        <div className="mb-2 w-full">
                            <input type="text" placeholder="Mot de passe" className="px-2 p-2 border w-full border-gray-200 rounded-xl" />
                        </div>
                        
                        <div className="w-full">
                            <input type="password" placeholder="Confirmer mot de passe" className="px-2 p-2 w-full border border-gray-200 rounded-xl" />
                        </div>

                        <button className="bg-black cursor-pointer hover:opacity-90 text-white rounded-xl p-2 px-2 mt-5">Envoyer</button>
                    </form>

                    <p className="mt-5 hover:underline cursor-pointer">Se connecter?</p>
                </div>
                <div className="w-[50%] h-full bg-red-100 rounded-xl flex flex-col items-center">
                    <img src={forgotpasswordImg} alt="illustration" className='h-full'/>
                    <h2></h2>
                </div>
            </div>
        </section>
    )
}