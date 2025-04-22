type StatItem = {
  value: string | number;
  label: string;
};

type StatsBarProps = {
  items: StatItem[];
};

export const StatsBar = ({ items }: StatsBarProps) => {
  return (
    <div className={`flex divide-x divide-gray-200 bg-white pb-6`}>
      {items.map(({ value, label }, i) => (
        <div key={i} className="flex-1 px-6 py-4 text-center">
          <p className="text-3xl  text-gray-700">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
};
