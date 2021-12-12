![alt text](https://github.com/sreemikil/Figma-co-pilot/blob/b8216cf300bd20d2fbbe076935f2ec6837f19964/assets/cover123.png)


# Figma Co-pilot
## Introduction         

![Figma Co-pilot Gif Example](https://github.com/AkshayBenny/figma-copilot/blob/386572a252a7a68cacee6ee0458231e6377f3546/assets/demogif.gif)



Find and fix errors in your designs with Figma Co-pilot , a plugin for Figma which help in following proper Design Guidelines to carve a better UI. 

Figma Co-pilot finds guideline erros within your designs on all your layers. Ensure your designs are ready for development or design collaboration by fixing inconsistencies.

While it's running, Figma Co-pilot will update automatically as you fix errors. Clicking on layer will also select that layer in your design. Navigating between each error is fast and much easier than trying to find errors on your own.

## Table of contents
* [Team members](#members)
* [Team Id](#id)
* [Features](#howitworks)
* [To Run Locally use following commands](#run)
* [Tooling / Tech stacks](#tts)

<a name="members"></a>
## Team members
![Akhil](https://github.com/itexpert2572000/Ctracker/blob/91a6a09e646eda69264b6611faa5278e0f03e1ab/readme_assets/tj.png) | ![Rafi Rasheed](https://github.com/sreemikil/Figma-co-pilot/blob/30c288622cbc571157268eef73c61d971829a01b/assets/rafi.png) | ![Suvarnesh K M](https://github.com/itexpert2572000/Ctracker/blob/91a6a09e646eda69264b6611faa5278e0f03e1ab/readme_assets/suvarneshkm.png) | ![Sreemikil T Manoharan](https://github.com/itexpert2572000/Ctracker/blob/91a6a09e646eda69264b6611faa5278e0f03e1ab/readme_assets/sreemikil.png) | ![Akshay Benny](https://github.com/sreemikil/Figma-co-pilot/blob/30c288622cbc571157268eef73c61d971829a01b/assets/akshay.png)
------------ | ------------- | ------------- | ------------- | ------------- 
[@akhil-tj](https://github.com/akhil-tj) | [@rafitc ](https://github.com/rafitc) | [@Suvarnesh K M](https://github.com/SuvarneshKM) | [@Sreemikil T Manoharan](https://github.com/sreemikil) | [@AkshayBenny](https://github.com/AkshayBenny)






<a name="id"></a>
## Team Id
* **THEKKINI**
<a name="Linktoproductwalkthrough"></a>


<a name="howitworks"></a>
## Features
- Selecting a layer with an error will also select the layer in Figma, letting you navigate your page and fix errors with full context.
- Figma Co-pilot polls for changes and will update as you fix errors.
- "Ignore" or "Ignore All" buttons let you skip special layers inorder to provide freedom for the designer.
- Use the "Select All" option to fix multiple errors at once that share the same value.
- Need to skip layers like illustrations? Locked layers in Figma will be skipped from linting.

<a name="video"></a>


<a name="run"></a>
## To Run Locally use following commands
* Run `yarn` to install dependencies.
* Run `yarn build:watch` to start webpack in watch mode.

<a name="what it do"></a>
## What does Figma Co-pilot check for by default?
Out of the box, Figma Co-pilot only checks for guideline and layout erros in each layer. In Figma, the best practice is to use styles and proper naming (also referred to as design tokens) on all of your layers, so your type, colors, spacing etc are all consistent and it will help the developer easily identify the elements and components.

That being said, Figma Co-pilot is ready for you to write custom rules for your team. For example, if you wanted to ensure that no text layers are using background specific colors, you can check out the example is provided below.

<a name="tts"></a>
## Tooling / Tech Stacks
- Figma
- TypeScript
- ReactJs
- Node.Js
- Webpack
<!--## Total Visitors

<img align="left" src = "https://profile-counter.glitch.me/flutter_ecommerce_app/count.svg" alt ="Loading"> ->



