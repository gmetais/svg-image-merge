# SVG Image Merge

A tool for image optimization freaks.

Let's say you want to add an image on your website, that contains both:
- a photography that could be compressed as a JPEG (using a PNG would make a huge file)
- some text or logo you want to be pixel perfect (JPEG compression would add some artefacts)

**This tool creates an single image, containing both the optimized background and the pixel perfect text.**

Of course, this could be done easily in HTML by positioning a transparent `<img>` over another `<img>`. Use this tool if you can't do that, if it needs to fit in a single field of a back-office for exemple.


Here is an example result file:

![svg example](https://raw.githubusercontent.com/gmetais/svg-image-merge/master/test/result.svg)


## How it works

It's very simple. It takes two images on your computer, base64 encodes both of them, then creates an SVG. The structure of the SVG is very simple and looks basically like this:
```html
<svg width="800" height="600">
    <image x="0" y="0" width="800" height="600" xlink:href="data:image/jpg;base64,{{base64-encoded-background}}" />
    <image x="0" y="0" width="800" height="600" xlink:href="data:image/png;base64,{{base64-encoded-top}}" />
</svg>
```

Once it's done, simply serve the new SVG like any other image in your HTML:
```
<img src="merged-image.svg" />
```

*Don't forget to check that your server is configured to properly* **gzip** *SVG images (content type `image/svg+xml`).*


### Installation
```npm install -g svg-image-merge```

### Usage
```svg-image-merge <background-file> <top-file> <output-file>```

### Example
```svg-image-merge background.jpg wording.png result.svg```

### Options
None for the moment


## Browser compatibility
Sorry my old IE8 friend, you're not able to understand SVG images...


## Author
Gaël Métais. I'm a webperf freelance based in Paris. If you understand french, you can visit [my website](http://www.gaelmetais.com).