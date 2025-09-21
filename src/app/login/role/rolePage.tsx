import { useParams } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";
import { useAuth } from "@app/hooks";

export default function RolePage() {
  const { role } = useParams();
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* Top section with image and heading */}
      <div className="border border-white/10 bg-black/60 p-6 rounded-md overflow-hidden max-w-6xl mx-auto mb-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl mx-auto mb-6">
            {role === "admin" ? (
              <img
                src="/images/v-disk-admin.png"
                className="w-full max-w-[300px] md:max-w-[400px] aspect-square object-cover mx-auto"
                loading="lazy"
                alt="v-disk admin"
              />
            ) : (
              <img
                src="/images/v-disk-user.png"
                className="w-full max-w-[300px] md:max-w-[400px] aspect-square object-cover mx-auto"
                loading="lazy"
                alt="v-disk user"
              />
            )}
          </div>

          <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider text-center">
            {role === "admin" ? "Painel do Admin" : `Hi, ${user?.name ?? "User"}!`}
          </h1>
          <p className="mt-3 mb-4 text-white/70 text-center">
            {role === "admin" ? "Manage products below" : "See your orders below"}
          </p>
        </div>
      </div>

      {/* Panels container */}
      <div>
        {role === "admin" ? <AdminPanel /> : <UserPanel />}
      </div>
    </section>
  );
}
