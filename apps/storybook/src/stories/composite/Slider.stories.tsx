import { Slider, type SliderRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@tailor-platform/styled-system/jsx";
import { slider } from "@tailor-platform/styled-system/recipes";
import { sliderTypes } from "../../ark-types";

Slider.Root.displayName = "Slider";

const classes = slider();

const meta = {
  title: "Composite/Slider",
  component: Slider.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...sliderTypes },
} satisfies Meta<SliderRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => (
    <Box w={400} h={100}>
      <Slider.Root
        className={classes.root}
        min={0}
        max={100}
        defaultValue={[33]}
        {...props}
      >
        <Slider.Control className={classes.control}>
          <Slider.Track className={classes.track}>
            <Slider.Range className={classes.range} />
          </Slider.Track>
          <Slider.Thumb className={classes.thumb} index={0} />
        </Slider.Control>
        <Slider.MarkerGroup className={classes.markerGroup}>
          <Slider.Marker className={classes.marker} value={25}>
            25
          </Slider.Marker>
          <Slider.Marker className={classes.marker} value={50}>
            50
          </Slider.Marker>
          <Slider.Marker className={classes.marker} value={75}>
            75
          </Slider.Marker>
        </Slider.MarkerGroup>
      </Slider.Root>
    </Box>
  ),
};
