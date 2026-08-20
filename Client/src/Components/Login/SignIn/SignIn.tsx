export default function SignIn() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-bl from-[#9073E9] to-[#5A39C6]">
      <div className="card card-side bg-base-100 shadow-sm">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            alt="Movie"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-2xl">
            <span className="font-bold text-4xl text-[#5B3AC9]">Login</span>{" "}
            your account
          </h2>
          <form className="space-y-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Username</legend>
              <input type="email" className="input" placeholder="Type your email here" />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input type="password" className="input" placeholder="*********" />
            </fieldset>
            <div className="aura">
              <button className="btn btn-wide btn-soft btn-primary">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
