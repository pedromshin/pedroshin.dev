"use client";
import PageOCR from "@Components/templates/PageOCR";

export default () => {
  enum RG_ALIAS_ENUM {
    RG_DOCUMENT_NUMBER = "RG_DOCUMENT_NUMBER",
    RG_DOCUMENT_EXPEDITION_DATE = "RG_DOCUMENT_EXPEDITION_DATE",
    RG_OWNER_PLACE_OF_BIRTH = "RG_OWNER_PLACE_OF_BIRTH",
    RG_OWNER_BIRTHDATE = "RG_OWNER_BIRTHDATE",
    RG_OWNER_NAME = "RG_OWNER_NAME",
    RG_OWNER_FATHER_NAME = "RG_OWNER_FATHER_NAME",
    RG_OWNER_MOTHER_NAME = "RG_OWNER_MOTHER_NAME",
    RG_DOCUMENT_ORIGIN = "RG_DOCUMENT_ORIGIN",
  }

  return (
    <PageOCR
      title="OCR RG"
      description="Extrair valores padronizados do verso do RG (frente é a página com foto e polegar, que não carrega nenhum dado a ser extraído)"
      fetchURL="/api/projects/ocr/analyse"
      queries={[
        {
          Text: "If there is a REGISTRO GERAL, what is the content? It is the main document number.",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_NUMBER,
        },
        {
          Text: "If there is a DATA DE EMISSAO, which is the documents emission date, what is its value?",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_EXPEDITION_DATE,
        },
        {
          Text: "What is the document owner's naturalness, or NATURALIDADE?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_PLACE_OF_BIRTH,
        },
        {
          Text: "What is the document owner's birthdate, that would be the documents DATA DE NASCIMENTO field value, given that it must be over 16 years ago?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_BIRTHDATE,
        },
        {
          Text: "What is the document owner's name, or NOME?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_NAME,
        },
        {
          Text: "Underneath the document owner's name, there are two names, which are values of field FILIACAO. What is the first name?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_FATHER_NAME,
        },
        {
          Text: "What is the value of the third name in the image, if there is one?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_MOTHER_NAME,
        },
        {
          Text: "What is the value in DOC ORIGEM, if there is one?",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_ORIGIN,
        },
      ]}
    />
  );
};
