type Props = {
  title: string;
  subtitle: string;
};

export default function AdminHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-10">

      <h1 className="text-4xl font-black text-pink-600">
        {title}
      </h1>

      <p className="mt-2 text-gray-500">
        {subtitle}
      </p>

    </div>
  );
}