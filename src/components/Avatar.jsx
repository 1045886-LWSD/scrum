export default function Avatar({ member, small = false }) {
  if (!member) return null;

  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full font-bold text-white ${small ? "size-7 text-[11px]" : "size-9 text-sm"}`}
      style={{ backgroundColor: member.color }}
      title={`${member.name}, ${member.role}`}
    >
      {member.avatar}
    </div>
  );
}
