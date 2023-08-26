"use client";
import PageOCR from "@Components/templates/PageOCR";

export default () => {
  enum CNH_ALIAS_ENUM {
    CNH_DOCUMENT_NUMBER = "CNH_DOCUMENT_NUMBER",
    CNH_OWNER_BIRTHDATE = "CNH_OWNER_BIRTHDATE",
    CNH_DOCUMENT_EXPIRY_DATE = "CNH_DOCUMENT_EXPIRY_DATE",
    CNH_OWNER_CPF = "CNH_OWNER_CPF",
    CNH_OWNER_NAME = "CNH_OWNER_NAME",
  }

  return (
    <PageOCR
      title="OCR CNH"
      fetchURL="/api/projects/ocr/analyse"
      queries={[
        { Text: "no registro", Alias: CNH_ALIAS_ENUM.CNH_DOCUMENT_NUMBER },
        {
          Text: "data de nascimento",
          Alias: CNH_ALIAS_ENUM.CNH_OWNER_BIRTHDATE,
        },
        { Text: "validade", Alias: CNH_ALIAS_ENUM.CNH_DOCUMENT_EXPIRY_DATE },
        { Text: "cpf", Alias: CNH_ALIAS_ENUM.CNH_OWNER_CPF },
        { Text: "nome", Alias: CNH_ALIAS_ENUM.CNH_OWNER_NAME },
      ]}
    />
  );
};
