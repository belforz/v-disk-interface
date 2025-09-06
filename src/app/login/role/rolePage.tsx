import { useParams } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";
import { useAuth } from "@app/hooks";

export default function RolePage() {
  const { role } = useParams();
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col items-center">
        {role === "admin" ? (
          <img
            src="/images/v-disk-admin.png"
            className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
            loading="lazy"
            alt="v-disk admin"
          />
        ) : (
          <img
            src="/images/v-disk-user.png"
            className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
            loading="lazy"
            alt="v-disk user"
          />
        )}

        <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider text-center mt-6">
          {role === "admin" ? "Painel do Admin" : `Hi, ${user?.name ?? "User"}!`}
        </h1>
        <p className="mt-3 text-white/70 text-center">
          {role === "admin" ? "Manage products below" : "See your orders below"}
        </p>
      </div>

      <div className="mt-8">
        {role === "admin" ? <AdminPanel /> : <UserPanel />}
      </div>
    </section>
  );
}
