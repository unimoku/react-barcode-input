import { useState } from "react";

type keyName = "Alt" | "AltGraph" | "CapsLock" | "Control" | "Fn" | "FnLock" | "Hyper" | "Meta" | "NumLock" | "ScrollLock" | "Shift" | "Super" | "Symbol" | "SymbolLock"
  | "Enter" | "Tab" | " "
  | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "End" | "Home" | "PageDown" | "PageUp"
  | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "Soft1" | "Soft2" | "Soft3" | "Soft4"
  | "Decimal" | "Key11" | "Key12" | "Multiply" | "Add" | "Clear" | "Divide" | "Subtract" | "Separator" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Props = {
  /**
   * Set to false if it is need to show screen keyboard.
   * @default true
   */
  readOnly?: boolean;

  /**
   * Key name of the end of input.
   * @default "Enter"
   */
  lastKey?: keyName;

  /**
   * Whether to allow empty or not.
   * @default true
   */
  allowBlurOnEmpty?: boolean;

  /**
   * Validator function that will run after received "lastKey."
   * @default code => true;
   */
  validator?: (code: string) => boolean;

  /**
   * Behavior if validator returned false.
   * @default "select"
   */
  actionOnError?: "select" | "clear" | "none";

  onSuccess: (code: string) => {};
  onFailure: (code: string) => {};

  /**
   * Maximum length of buffer.
   * This props is not set to input element.
   * @default 256
   */
  maxLength?: number;

  prefix?: string;
  surfix?: string;

  id?: string;
  className?: string;
  name?: string;
}


const BarcodeInput: React.FC<Props> = ({
  readOnly = true,
  lastKey = "Enter",
  allowBlurOnEmpty = true,
  validator = (code) => true,
  actionOnError = "select",
  onSuccess = (code) => {},
  onFailure = (code) => {},
  maxLength = 256,
  prefix = "",
  surfix = "",
  id,
  className,
  name,
}) => {

  let buffer: string = "";
  const [code, setCode] = useState("");

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === lastKey) {
      // Reached the last charactor
      const value = buffer.slice();

      if (validator(value)) {
        // Success
        // setCode(`${prefix}${value}${surfix}`);
        onSuccess(`${prefix}${value}${surfix}`)

      } else {
        // Error
        switch (actionOnError) {
          case "select":
            // setCode(value);
            setTimeout(() => {
              (e.target as HTMLInputElement).select();
            }, 0);
            break;

          case "clear":
            setCode("");
            break;

          default:
            break;
        }
        onFailure(value);
      }

      // Buffer clear
      buffer = "";

    } else {
      // On going
      if (buffer.length <= maxLength) {
        buffer += e.key;
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!allowBlurOnEmpty && code === "") {
      // Refocus
      setTimeout(() => {
        e.target.focus();
      }, 0);
    }
  }

  return <input
    type="text"
    id={id}
    className={className}
    name={name}
    defaultValue={code}
    readOnly={readOnly}
    onKeyUp={handleKeyUp}
    onBlur={handleBlur}
  />;
}
export default BarcodeInput;