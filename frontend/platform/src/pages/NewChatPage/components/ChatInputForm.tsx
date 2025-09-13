import { Input } from "@/components/bs-ui/input";
import MultiSelect from "@/components/bs-ui/input-select/multi";
import SelectSearch from "@/components/bs-ui/input-select/select";
import { useToast } from "@/components/bs-ui/toast/use-toast";
import { WorkflowNodeParam } from "@/types/flow";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../style/select.less";

const enum FormItemType {
  Text = "text",
  File = "file",
  Select = "select",
}

export default forwardRef(function ChatInputForm(
  {
    data,
  }: {
    data: WorkflowNodeParam;
  },
  ref,
) {
  const { t } = useTranslation();

  const formDataRef = useRef(
    data.value.reduce((map, item) => {
      map[item.key] = {
        key: item.key,
        type: item.type,
        label: item.value,
        fileName: "",
        value: "",
      };
      return map;
    }, {}),
  );

  const handleChange = (item, value) => {
    if (item.type === FormItemType.File) {
      formDataRef.current[item.key].value = Array.isArray(value)
        ? value
        : [value];
    } else {
      formDataRef.current[item.key].value = value;
    }
  };

  const updataFileName = (item, fileName) => {
    formDataRef.current[item.key].fileName = fileName;
  };

  const { message } = useToast();
  const submit = () => {
    const valuesObject = {};
    let stringObject = "";
    const errors = [];

    Object.keys(formDataRef.current).forEach((key: string) => {
      const fieldData = formDataRef.current[key];
      const required = data.value.find((item) => item.key === key).required;
      if (required && !fieldData.value) {
        errors.push(t("report.requiredField", { label: fieldData.label }));
      }
      valuesObject[key] = fieldData.value;
      stringObject += `${fieldData.label}:${fieldData.type === FormItemType.File ? fieldData.fileName : fieldData.value}\n`;
    });

    if (errors.length) {
      return message({
        description: errors,
        variant: "warning",
      });
    }
    const myEvent = new CustomEvent("inputFormEvent", {
      detail: {
        data: valuesObject,
        msg: stringObject,
      },
    });
    document.dispatchEvent(myEvent);
  };

  const [multiVal, setMultiVal] = useState([]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    submit: () => submit(),
  }));

  return (
    <div className="chat-input-form">
      {data?.value.map((item, index) => (
        <>
          <span className="w-auto">{item.value}</span>
          {item.type === "select" && (
            <SelectSearch
              selectPlaceholder={"请选择"}
              onValueChange={(val) => handleChange(item, val)}
              selectClass="w-auto h-[32px] bg-[#F1F5FF] rounded-lg border-[#F1F5FF] focus:ring-0 select"
              options={item.options.map((el) => ({
                label: el.text,
                value: el.text,
              }))}
              onChange={null}
            ></SelectSearch>
          )}
          {item.type === "multiSelect" && (
            <MultiSelect
              placeholder="请选择"
              multiple
              hideSearch
              className="w-auto h-[32px] bg-[#F1F5FF] rounded-lg border-[#F1F5FF] focus:ring-0 select"
              value={multiVal[item.key] || []}
              options={item.options.map((el) => ({
                label: el.text,
                value: el.text,
              }))}
              onChange={(v) => {
                setMultiVal((prev) => ({ ...prev, [item.key]: v }));
                handleChange(item, v.join(","));
              }}
            ></MultiSelect>
          )}
          {item.type === "text" && (
            <Input
              boxClassName="h-[32px] bg-[#F1F5FF] rounded-lg border-[#F1F5FF] focus:ring-0 w-auto"
              className="h-[32px] bg-[#F1F5FF] rounded-lg border-[#F1F5FF] focus:ring-0 inputText text-[#0057FF]"
              placeholder="请输入"
              onChange={(e) => handleChange(item, e.target.value)}
            ></Input>
          )}
          <span>{index === data?.value.length - 1 ? "。" : "，"}</span>
        </>
      ))}
    </div>
  );
});
