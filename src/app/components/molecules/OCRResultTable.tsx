export default ({
  data,
}: {
  data: Array<
    | {
        field: string;
        value?: string;
        error?: never;
      }
    | { field: string; value?: never; error?: string }
  >;
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-start border border-solid p-4">Campo</th>
          <th className="text-start border border-solid p-4">Valor</th>
          <th className="text-start border border-solid p-4">Erro</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => {
          return (
            <tr key={index}>
              <td className="text-start border border-solid">{entry.field}</td>
              <td className="text-start border border-solid">{entry.value}</td>
              <td className="text-start border border-solid">{entry.error}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
