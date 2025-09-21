import type { User } from "@app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faUserShield } from "@fortawesome/free-solid-svg-icons";

type Props = {
  user: User;
  
};

export default function UserCard({ user }: Props) {
  return (
    <div className="border border-white/10 bg-neutral-900 p-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/40 grid place-items-center text-white/70">
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-white/60">{user.email}</div>
          </div>
        </div>

        <div className="text-right text-xs text-white/60">
          <div className="flex items-center gap-2 justify-end">
            <FontAwesomeIcon icon={faUserShield} className="text-white/40" />
            <span className="uppercase">{user.roles?.[0] || "user"}</span>
          </div>
          <div className="mt-2">{new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
