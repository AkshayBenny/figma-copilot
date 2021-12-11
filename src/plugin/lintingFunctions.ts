// Linting functions

// Generic function for creating an error object to pass to the app.
export function createErrorObject(node, type, message) {
  let error = {
    message: "",
    type: "",
    node: ""
  };

  error.message = message;
  error.type = type;
  error.node = node;

  // if (value !== undefined) {
  //   error.value = value;
  // }

  return error;
}

// Determine a nodes fills
export function determineFill(fills) {
  let fillValues = [];

  fills.forEach(fill => {
    if (fill.type === "SOLID") {
      let rgbObj = convertColor(fill.color);
      fillValues.push(RGBToHex(rgbObj["r"], rgbObj["g"], rgbObj["b"]));
    } else if (fill.type === "IMAGE") {
      fillValues.push("Image - " + fill.imageHash);
    } else {
      const gradientValues = [];
      fill.gradientStops.forEach(gradientStops => {
        let gradientColorObject = convertColor(gradientStops.color);
        gradientValues.push(
          RGBToHex(
            gradientColorObject["r"],
            gradientColorObject["g"],
            gradientColorObject["b"]
          )
        );
      });
      let gradientValueString = gradientValues.toString();
      fillValues.push(`${fill.type} ${gradientValueString}`);
    }
  });

  return fillValues[0];
}

// Lint border radius
export function checkRadius(node, errors, radiusValues) {
  let cornerType = node.cornerRadius;

  if (typeof cornerType !== "symbol") {
    if (cornerType === 0) {
      return;
    }
  }

  // If the radius isn't even on all sides, check each corner.
  if (typeof cornerType === "symbol") {
    if (radiusValues.indexOf(node.topLeftRadius) === -1) {
      return errors.push(
        createErrorObject(
          node,
          "radius",
          "Incorrect Top Left Radius"
          // node.topRightRadius
        )
      );
    } else if (radiusValues.indexOf(node.topRightRadius) === -1) {
      return errors.push(
        createErrorObject(
          node,
          "radius",
          "Incorrect top right radius"
          // node.topRightRadius
        )
      );
    } else if (radiusValues.indexOf(node.bottomLeftRadius) === -1) {
      return errors.push(
        createErrorObject(
          node,
          "radius",
          "Incorrect bottom left radius"
          // node.bottomLeftRadius
        )
      );
    } else if (radiusValues.indexOf(node.bottomRightRadius) === -1) {
      return errors.push(
        createErrorObject(
          node,
          "radius",
          "Incorrect bottom right radius"
          // node.bottomRightRadius
        )
      );
    } else {
      return;
    }
  } else {
    if (radiusValues.indexOf(node.cornerRadius) === -1) {
      return errors.push(
        createErrorObject(
          node,
          "radius",
          "Incorrect border radius"
          // node.cornerRadius
        )
      );
    } else {
      return;
    }
  }
}

// Custom Lint rule that isn't being used yet!
// that ensures our text fills aren't using styles (design tokens) meant for backgrounds.

export function customCheckTextFills(node, errors) {
  // Here we create an array of style keys (https://www.figma.com/plugin-docs/api/PaintStyle/#key)
  // that we want to make sure our text layers aren't using.
  const fillsToCheck = [
    "4b93d40f61be15e255e87948a715521c3ae957e6"
    // To collect style keys, use a plugin like Inspector, or use console commands like figma.getLocalPaintStyles();
    // in your design system file.
  ];

  let nodeFillStyle = node.fillStyleId;

  // If there are multiple text styles on a single text layer, we can't lint it
  // we can return an error instead.
  if (typeof nodeFillStyle === "symbol") {
    return errors.push(
      createErrorObject(
        node, // Node object we use to reference the error (id, layer name, etc)
        "fill", // Type of error (fill, text, effect, etc)
        "Mixing two styles together" // Message we show to the user
        // "Multiple Styles" Normally we return a hex value here
      )
    );
  }

  // We strip the additional style key characters so we can check
  // to see if the fill is being used incorrectly.
  nodeFillStyle = nodeFillStyle.replace("S:", "");
  nodeFillStyle = nodeFillStyle.split(",")[0];

  // If the node (layer) has a fill style, then check to see if there's an error.
  if (nodeFillStyle !== "") {
    // If we find the layer has a fillStyle that matches in the array create an error.
    if (fillsToCheck.includes(nodeFillStyle)) {
      return errors.push(
        createErrorObject(
          node, // Node object we use to reference the error (id, layer name, etc)
          "fill", // Type of error (fill, text, effect, etc)
          "Incorrect text color use" // Message we show to the user
          // "Using a background color on a text layer"  Determines the fill, so we can show a hex value.
        )
      );
    }
    // If there is no fillStyle on this layer,
    // check to see why with our default linting function for fills.
  } else {
    checkBtns(node, errors);
    checkAlign(node, errors);
    checkFloatingShadowBtn(node, errors);
    checkFont(node, errors);
  }
}

// Check for effects like shadows, blurs etc.
export function checkEffects(node, errors) {
  if (node.effects.length) {
    if (node.effectStyleId === "") {
      const effectsArray = [];

      node.effects.forEach(effect => {
        let effectsObject = {
          type: "",
          radius: "",
          offsetX: "",
          offsetY: "",
          fill: "",
          value: ""
        };

        // All effects have a radius.
        effectsObject.radius = effect.radius;

        if (effect.type === "DROP_SHADOW") {
          effectsObject.type = "Drop Shadow";
        } else if (effect.type === "INNER_SHADOW") {
          effectsObject.type = "Inner Shadow";
        } else if (effect.type === "LAYER_BLUR") {
          effectsObject.type = "Layer Blur";
        } else {
          effectsObject.type = "Background Blur";
        }

        if (effect.color) {
          let effectsFill = convertColor(effect.color);
          effectsObject.fill = RGBToHex(
            effectsFill["r"],
            effectsFill["g"],
            effectsFill["b"]
          );
          effectsObject.offsetX = effect.offset.x;
          effectsObject.offsetY = effect.offset.y;
          effectsObject.value = `${effectsObject.type} ${effectsObject.fill} ${effectsObject.radius}px X: ${effectsObject.offsetX}, Y: ${effectsObject.offsetY}`;
        } else {
          effectsObject.value = `${effectsObject.type} ${effectsObject.radius}px`;
        }

        effectsArray.unshift(effectsObject);
      });

      let currentStyle = effectsArray[0].value;

      return errors.push(
        createErrorObject(
          node,
          "effects",
          "Missing effects style"
          // currentStyle
        )
      );
    } else {
      return;
    }
  }
}

export function checkBtns(node, errors) {
  if (node.name === "btn") {
    let childText = node.children[0].characters;

    if (childText.split("\n").length > 1) {
      return errors.push(
        createErrorObject(
          childText, // Node object we use to reference the error (id, layer name, etc)
          "text", // Type of error (fill, text, effect, etc)
          "Multi line text found In Button" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
        )
      );
    } else {
      return;
    }
  }
}

// export function checkBtnIcon(node, errors) {
//   if (node.name === 'btn') {
//     let childText = node.children
//   if (childText.length > 2) {
//     return errors.push(
//       createErrorObject(
//         childText,
//         'text',
//         'Too many icons per button'
//       )
//     )
//   }
//   }
// }

export function checkAlign(node, errors) {
  let childText = node.name;

  if (node.name === "btn") {
    var a = node.paddingTop;
    var b = node.paddingBottom;
    var c = node.paddingLeft;
    var d = node.paddingRight;

    if (a === b && c === d) {
      return;
    } else {
      return errors.push(
        createErrorObject(
          childText, // Node object we use to reference the error (id, layer name, etc)
          "text", // Type of error (fill, text, effect, etc)
          "Button text not aligned" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
        )
      );
    }
  }
}

export function checkFont(node, errors) {
  if (node.name === "body") {
    let childText = node.fontName;
    if (
      childText.family === "Display" ||
      childText.family === "Lucida Calligraphy" ||
      childText.family === "Lucida Handwriting" ||
      childText.family === "Ruslan Display"
    ) {
      return errors.push(
        createErrorObject(
          childText,
          "text",
          "font family not good for body texts"
        )
      );
    }
  }
}

export function checkFloatingShadowBtn(node, errors) {
  if (node.name === "floatingActionBtn") {
    let childText = node.name;
    // let floatingActionBtn = node;
    if (node.effects.length === 0) {
      return errors.push(
        createErrorObject(
          childText, // Node object we use to reference the error (id, layer name, etc)
          "text", // Type of error (fill, text, effect, etc)
          "Shadow effect not found found for floating action button" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
        )
      );
    } else {
      return;
    }
  }
}

export function checkStrokes(node, errors) {
  if (node.strokes.length) {
    if (node.strokeStyleId === "" && node.visible === true) {
      let strokeObject = {
        strokeWeight: "",
        strokeAlign: "",
        strokeFills: []
      };

      strokeObject.strokeWeight = node.strokeWeight;
      strokeObject.strokeAlign = node.strokeAlign;
      strokeObject.strokeFills = determineFill(node.strokes);

      let currentStyle = `${strokeObject.strokeFills} / ${strokeObject.strokeWeight} / ${strokeObject.strokeAlign}`;

      return errors
        .push
        // createErrorObject(node, "stroke", "Missing stroke style", currentStyle)
        ();
    } else {
      return;
    }
  }
}

export function checkType(node, errors) {
  if (node.textStyleId === "" && node.visible === true) {
    let textObject = {
      font: "",
      fontStyle: "",
      fontSize: "",
      lineHeight: {}
    };

    textObject.font = node.fontName.family;
    textObject.fontStyle = node.fontName.style;
    textObject.fontSize = node.fontSize;

    // Line height can be "auto" or a pixel value
    if (node.lineHeight.value !== undefined) {
      textObject.lineHeight = node.lineHeight.value;
    } else {
      textObject.lineHeight = "Auto";
    }

    let currentStyle = `${textObject.font} ${textObject.fontStyle} / ${textObject.fontSize} (${textObject.lineHeight} line-height)`;

    return errors
      .push
      // createErrorObject(node, "text", "Missing text style", currentStyle)
      ();
  } else {
    return;
  }
}

// Utility functions for color conversion.
const convertColor = color => {
  const colorObj = color;
  const figmaColor = {};

  Object.entries(colorObj).forEach(cf => {
    const [key, value] = cf;

    if (["r", "g", "b"].includes(key)) {
      figmaColor[key] = (255 * (value as number)).toFixed(0);
    }
    if (key === "a") {
      figmaColor[key] = value;
    }
  });
  return figmaColor;
};

function RGBToHex(r, g, b) {
  r = Number(r).toString(16);
  g = Number(g).toString(16);
  b = Number(b).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}
