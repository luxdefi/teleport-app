import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import Image from "next/image";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "transparent",
      border: "1px dashed rgba(0, 144, 255, 1)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "transparent",
      border: "1px dashed rgba(152, 34, 187, 1)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 1,
    border: 0,
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({}) => ({
  backgroundColor: "transparent",
  zIndex: 1,
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
}));

function ColorlibStepIcon(props: StepIconProps & { steps: any }) {
  const { active, completed, className, steps } = props;

  const icons: { [index: string]: React.ReactElement } = steps?.reduce(
    (acc, _, i) => ({
      ...acc,
      [i + 1]: (
        <Image
          src={`${_.logo}`}
          alt=""
          width={40}
          height={40}
          className="rounded-full"
        />
      ),
    }),
    {}
  );

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

interface Step {
  label: string;
  icon: number;
  logo: string;
  sublabel?: string;
}

export default function CustomizedSteppers({ steps }: { steps: Step[] }) {
  return (
    <div style={{ width: "100%", marginBottom: 24, marginTop: 50 }}>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper
          alternativeLabel
          activeStep={steps.length - 1}
          connector={<ColorlibConnector />}
        >
          {steps.map((label) => (
            <Step key={label.icon}>
              <StepLabel
                StepIconComponent={(e) =>
                  ColorlibStepIcon({ ...e, steps: steps })
                }
              >
                <p className="text-white font-semibold text-base">
                  {label.label}
                </p>
                {label.sublabel && (
                  <p className="opacity-50 text-xs text-white">Private Routing</p>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </div>
  );
}
