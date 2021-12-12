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

  return error;
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
  } else {
    checkBtns(node, errors);
    checkAlign(node, errors);
    checkFloatingAlign(node, errors);
    checkFloatingShadowBtn(node, errors);
    checkFont(node, errors);
    checkLabelLength(node, errors);
    checkLabelOpacity(node, errors);
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

export function checkLabelLength(node, errors) {
  if (node.name === "textField") {
    let childText = node.children.length;
    if (childText === 0) {
      return errors.push(
        createErrorObject(
          childText, // Node object we use to reference the error (id, layer name, etc)
          "text", // Type of error (fill, text, effect, etc)
          "No Label Found add a new label" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
        )
      );
    } else {
      return;
    }
  }
}

export function checkLabelOpacity(node, errors) {
  if (node.name === "textField" && node.children.length != 0) {
    let childText = node.children[0].opacity;
    if (childText != 0.5) {
      return errors.push(
        createErrorObject(
          childText, // Node object we use to reference the error (id, layer name, etc)
          "text", // Type of error (fill, text, effect, etc)
          "Opacity of the label is not 0.5" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
        )
      );
    } else {
      return;
    }
  }
}

export function checkFont(node, errors) {
  if (node.type === "TEXT") {
    let childText = node.fontName.family;
    if (
      childText === "Redacted Script" ||
      childText === "Abril Fatface" ||
      childText === "Bebas Neue" ||
      childText === "Lobster" ||
      childText === "Comfortaa"
    ) {
      return errors.push(
        createErrorObject(
          childText, // Node object we use to reference the error (id, layer name, etc)
          "text", // Type of error (fill, text, effect, etc)
          "Display font is not allowed" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
        )
      );
    } else {
      return;
    }
  }
}

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

export function checkFloatingAlign(node, errors) {
  let childText = node.name;

  if (node.name === "floatingActionBtn") {
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
          "Floating Action Button text not aligned" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
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
          "Shadow effect not found for floating action button" // Message we show to the user
          // "In Button"
          // Determines the fill, so we can show a hex value.
        )
      );
    } else {
      return;
    }
  }
}
