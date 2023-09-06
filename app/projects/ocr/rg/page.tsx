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
          Text: "If there is a REGISTRO GERAL, what is the content?",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_NUMBER,
        },
        {
          Text: "If the is an DATA DE EMISSAO, what is the content?",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_EXPEDITION_DATE,
        },
        {
          Text: "naturalidade",
          Alias: RG_ALIAS_ENUM.RG_OWNER_PLACE_OF_BIRTH,
        },
        {
          Text: "What is DATA DE NASCIMENTO value, given that it is garanteed to be over 16 years ago?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_BIRTHDATE,
        },
        { Text: "nome", Alias: RG_ALIAS_ENUM.RG_OWNER_NAME },
        {
          Text: "what is the content of the first line of filiacao?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_FATHER_NAME,
        },
        {
          Text: "what is the content of the second line of filiacao?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_MOTHER_NAME,
        },
        {
          Text: "city and state in 'doc origem'",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_ORIGIN,
        },
      ]}
    />
  );
};
