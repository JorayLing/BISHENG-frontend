import React, { forwardRef } from "react";
import Abilities from "./abilities.svg?react";
import Flow from "./flow.svg?react";
import Helper from "./helper.svg?react";

export const HelperIcon = forwardRef<
  SVGSVGElement & { className: any },
  React.PropsWithChildren<{ className?: string }>
>((props, ref) => {
  return <Helper ref={ref} {...props} />;
});

export const FlowIcon = forwardRef<
  SVGSVGElement & { className: any },
  React.PropsWithChildren<{ className?: string }>
>((props, ref) => {
  return <Flow ref={ref} {...props} />;
});

export const AbilitiesIcon = forwardRef<
  SVGSVGElement & { className: any },
  React.PropsWithChildren<{ className?: string }>
>((props, ref) => {
  return <Abilities ref={ref} {...props} />;
});
