export interface FormInputProps {
    name: string;
    control: any;
    label?: string;
    setValue?: any;
    sx?: any;
    disabled?: boolean; // add `disabled` property with optional `boolean` type
}