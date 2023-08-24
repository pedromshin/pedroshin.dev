import { TextractableDocumentResultType } from "@App/types/TextractableDocumentResultType";

export default ({ data }: { data: TextractableDocumentResultType }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-start border border-solid p-4">Campo</th>
            <th className="text-start border border-solid p-4">Valor</th>
            <th className="text-start border border-solid p-4">Erro</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((entry, index) => {
            return (
              <tr key={index}>
                <td className="text-start border border-solid">
                  {entry.field}
                </td>
                <td className="text-start border border-solid">
                  {entry.value}
                </td>
                <td className="text-start border border-solid">
                  {entry.error}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
