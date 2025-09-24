import { useState } from "react";
import { LogInSection } from "@app/components/LogInSection";
import { SignUpSection } from "@app/components/SingUpSection";


export default function LoginPage() {
  const [showForm, setShowForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  let imgSrc = `/images/v-disk-cover.png`;
  if (showSignUp) imgSrc = `/images/v-disk-women.png`;
  if (showForm) imgSrc = `/images/v-disk-login.png`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-[7.5rem] ">
      <div className="grid md:grid-cols-1 gap-10 ">
        <div className="flex flex-col items-center">
          <div className="bg-neutral-900">
            <img
              src={imgSrc}
              className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
              loading="lazy"
              alt="v-disk login"
            />
          </div>
          {!showForm && !showSignUp && (
            <>
              <div className="pt-6 pb-4 text-center">
                <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider">
                  Welcome!
                </h1>
                <p className="mt-3 text-white/70">Please log in to continue.</p>
              </div>
              <div className="flex gap-4 md:gap-6">
                <button
                  className="mt-6 border border-white/20 hover:border-white/50 px-6 py-3 uppercase tracking-widest text-xs"
                  onClick={() => setShowForm(true)}
                >
                  Login
                </button>
                <button
                  className="mt-6 border border-white/20 hover:border-white/50 px-6 py-3 uppercase tracking-widest text-xs"
                  onClick={() => setShowSignUp(true)}
                >
                  Sign-up
                </button>
              </div>
            </>
          )}
          {showForm && (
            <div className="mt-8">
              <LogInSection />
            </div>
          )}
          {showSignUp && (
            <div className="mt-8">
              <SignUpSection />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
