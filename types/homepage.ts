import { Dispatch, SetStateAction } from "react";

export interface HomepageForm {
  hero_description: string;

  about_title: string;
  about_description: string;

  cta_title: string;
  cta_description: string;

  whatsapp_message: string;
}

export interface HomepageCardProps {
  form: HomepageForm;
  setForm: Dispatch<SetStateAction<HomepageForm>>;
}