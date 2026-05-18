import Link from "next/link";

type Props = {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({ icon = "📭", title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1]">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-semibold text-lg mb-1">{title}</p>
      {description && <p className="text-[#878a8c] text-sm mb-4">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition mt-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
