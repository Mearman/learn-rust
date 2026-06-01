import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { vars } from "./theme.css.js";

const responsiveProperties = defineProperties({
    conditions: {
        mobile: {},
        tablet: { "@media": "screen and (min-width: 760px)" },
    },
    defaultCondition: "mobile",
    properties: {
        display: ["flex", "grid", "block", "inline-flex", "none"],
        flexDirection: ["row", "column"],
        flexWrap: ["wrap", "nowrap"],
        alignItems: ["flex-start", "flex-end", "center", "stretch", "baseline"],
        justifyContent: ["flex-start", "flex-end", "center", "space-between"],
        gap: vars.colour,
        paddingTop: vars.colour,
        paddingBottom: vars.colour,
        paddingLeft: vars.colour,
        paddingRight: vars.colour,
    },
});

const colourProperties = defineProperties({
    properties: {
        background: vars.colour,
        color: vars.colour,
    },
});

export const sprinkles = createSprinkles(
    responsiveProperties,
    colourProperties
);
