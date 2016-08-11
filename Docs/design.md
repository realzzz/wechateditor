# KC Markdown

KC Markdown protocol serves for the wechat artical editor. Including key features:

```
1\.  HTML elements mapper, be able to present the text/image/audio/video, be able to modify the attributes ( supported by HTML5 accordingly.)
2\.  HTML container, supports horizontal or vertical layout, dynamic add/editor/remove elements from them.
3\.  HTML template, supports unlimited templates - can be pre-defined or self-defined.
4\.  Thirdparty link converter, fetch & persist thirdparty links data and present it as predefined formats.
5\.  Dule-way modification, can either write KCMarkdown to generate the HTML or modify the HTML to change KCMarkdown.  (But create HTML directly will result in the same code block insder KC Markdown)
```

--------------------------------------------------------------------------------

Regardless of how KC Markdown is displayed, this is going to be provided as services, including two major type of APIs, Render and Modify. Typical usage of the KC Markdown service as follow:

```
KC Markdown  ---- Render API  --->  HTML
Render Api is responsible for convert the KC Markdow into HTML, either using whole block or paritially.

KC Markdown  <--- Modify API  ----  HTML
Modify API is used to modify the layout/attributes/values for certain elements or container.
```

--------------------------------------------------------------------------------

# KC Markdown ids:

As we need to support to dule way modification, it's important to have an id mechanism to specify the target object that's going to be modified, but I'm preferring to use a light weight id algorithm. Here is how it works:

## If under the same level there are more than one block that is using the same type, then these blocks needs to add ids by sequence start from 0\. Otherwise no ids are required.

```
For example:

<div>
    <div id="0"> </div>
    <div id="1"> </div>
</div>
```

For outside div no id is required since it only have one div in the same level. For inner div id is provided to distinguish two divs that is in the same level.

# KC Markdown formats:

KC Markdown use json format, it's simple, easy to understand and widely used in nowadays development. I just wouldn't come up with a better solution. ;-)

## Naming rules

1. Use lower case - do NOT use upper cases unless it's really necessary.
2. TBD

## OverAll structure:

Every KC MarkDown is an JSON Object, it contains several global attributes and ONE array named KC to present all the blocks. So a KC Markdown will look like this:

Article id - all of the editor article has a unique id to operate on root - the root element(no matter what this is, need to set this attribute true).

```
{
    "articleid":"id",
    "root":true,
    "globalvar1":"value1",
    "globalvar2":"value2",
    "globalvar3":"value3",
    "kc": {
        "kctype":"container",
        "direction":"V",
        "items":[
            { ...BLOCK ONE... },
            { ...BLOCK TWO... },
            { ...BLOCK THREE... }
        ]
    }
}
```

Note the Global variables are pending to be defined.

## KC Elements

// TODO - add useful attributes for all the types // TODO - how to define colors

KC Elements are distinguished via type name, including text, image, audio, video. Also with different attributes that comes lone with the element. Note the value is just another attributes of elements.

```
Common attributes that can be defined by all the elements
1\. width
2\. height
3\. layout - explained in KC Containers
```

--------------------------------------------------------------------------------

```
Text
    {
        "kctype":"text",
        "chtrstyle": ["n-m":{"font":"Arial",
                        "fontsize":"16",
                        "fontstyle":"",
                        "fontweight":"",
                        "textalign":"",
                        "textintent":"",
                        "textcolor":""}
                       ....
                     ],
        "textchange":{"n-m", "text"};
        "style":{"background":"",
                 "padding":"10",},
        "letterspace":"",

        ...
    }

    style belong to overall style
    chtrstyle is style for each character, it give all ranges + style

    width
    height
    font    (font-family、font-size、font-weight、font-style)
    background  (background-color、background-position、background-size、background-repeat、background-image)
    color   
    direction   
    letter-spacing  
    line-height     
    text-align      
    text-decoration     
    text-indent     
    text-shadow     
    vertical-align      
    white-space     
    word-spacing    
    word-wrap   
    text-overflow   

    border  (border-bottom-color、border-bottom-style、border-bottom-width、border-left-color、border-left-style、border-left-width、border-right-color、border-right-style、border-right-width、border-top-color、border-top-style、border-top-width)
    border-radius   (border-bottom-left-radius、border-bottom-right-radius、border-top-left-radius、border-top-right-radius)
    opacity

List
    {
        "kctype":"list",
        "dot":"",  // either type 1- 5, or with image src
        "value":[ __Array_of_list_value__]
    }

    list-style  (list-style-image、list-style-position、list-style-type)

REMOVE LINK DUE TO WC NOT SUPPORT
Link (Inherit Text Attributes)
    {
        "kctype":"link",
        "display":"__Display_value__",
        "url":"__Link_url__",
    }

    href           
    target   （_blank、_parent、_self、_top、framename）

Table  // I'm not sure if we really need this?
    {
        "kctype":"table",
        "col":__col_count__,
        "row":__row_count__,
        "values":[[],[]],
    }

Image
    {
        "kctype":"image",
        "src" :"",  // think about the domain limitation here, better to serve all image in our site
        "width":"",
        "height":"",
        "placeholder":"",
        ...
    }

    alt           
    src            
    width、height   

Audio
    {
        "kctype":"audio",
        "src":"",
        ...
    }
    autoplay   
    controls  
    loop      
    muted    
    src       

Video
    {
        "kctype":"video",
        "src":"",
        "autoplay":true,
        "repeat":true,
        "console":true,
        "mute":true,
        ...
    }
    autoplay     
    controls       
    loop          
    muted       
    src           
    poster       
    width      
    height
```

## KC Containers

The most important attributes for container is direction, it has to be "h" or "v" (Default is v - vertical). Other attributes: width, height, borderwidth, bordercolor, ....

```
{
    "kctype":"container",
    "direction":"v",
    "width":"100%",
    "height":"200px",
    "align":"center",
    "items":[]      // blocks of the items
    ...
}
```

For elements insider the container, they also have the layout attribute, it can be :

- relative - layout the element according to container's layout.
- float - layout the element based it's own posx and posy attibutes.
- width/height - define the element's width and height.

For container itself, it can also be other container's elements, thus it can also have layout attributes, comes along with other attributes like "posx", "posy", "width", "height".

## KC Templates

Every template has it's tid, each template has a own block of HTML code, the value or property of html will be inserted when rendering the template.

The values for the elements inside the template is defined by "path to find the element" (Refer to Next section) + "value".

For example: { "kctype":"template", "tid":"k00001", "container#text":"value" }

```
Render to :
<section type="container" width="100%" height="200px">
    <label type="text">test template one</label>
</section>
```

The attributes for the elements inside the template is defined by "path to find the element" + "attrname"#"attrvalue"

For example: { "kctype":"template", "tid":"k00002", "container#img":"src#imgsrc" }

```
Render to :
<section type="container" width="100%" height="200px">
    <img type="img" src="imgsrc">
</section>
```

KCObject can also be inserted into template, it is the same as value case, only the value shall be started with @.

For example: { "kctype":"template", "tid":"k0002", "container#img":"@{'kctype':'text', 'value':'testvalue'}" }

```
Rendered to
<section type="container" width="100%" height="200px">
    <img type="image" src="">
    <label type="text">testvalue</label>
</section>
```

## Path to find the element

In modify API or template value change, it's quite usual to refer to a element inside the container, so how do we do that?

Path can be used here, it refers the way from the root container down to any specific elements. Rules:

1. Name of each step is the type value. (Corresponding to the Json type)
2. Each level of the path is joined by "#".
3. Within one level, the path is defined by type + '.' + id, if there is no id, then simply use type or type.0.

For example:

```
<section type="container">
    <label type="text">test template one</label>
    <input type="input" id="0"> first input </input>
    <input type="input" id="1"> second input </input>
    <ul type="list">
        <li type="listitem" id ="0">
        </li>
        <li id ="1">
        </li>
    </ul>
</section>
```

Refer to the second input in above section template, the path is: "container#input.1"

Refer to second li item in the div, the path is: "container#list#listitem.1"

_IMPORTANT_ NOTE for the root container - as this is 99.9% same, it shall not appear in the path, for example :

{ "kctype":"container", "direction":"V", "items":[ { "kctype":"text" } { "kctype":"container", "items":[{"kctype":"image"}] } ] }

Path refering to the text element is simply "text" instead of "container#text" Path refering to the image insider the container is "container#image"

## KC Thirdparty links

KC thirdparty linker is supposed to serve as a snapshot presentation for all kinds of website links. For now we focus on weibo and taobao links.

The format of thirdparty link:

```
{
    "kctype":"tplink",
    "src":"weibo",
    "url":"",
    "allowcache":"",
    ...
}
```

Ideally everything from the thirdparty link shall be first fetched and stored in our server, so that all the links that points to this URL won't need to fetch data again.

Also we can provide mulit templates to present the result, this is to be defined.

## Inline HTML block support

Inline html use type "inlineblock", may be we can include our the other inline data format in this tag. The content is stored in base64 encoded format. Other formats still waiting to be added. The content will be rendered directly into final result.

For example:

```
{
    "kctype":"inline",
    "content":"<section>plainsection</section>",
}
```

## More to come

Things like signature, orginal link can be easily supported based on above rules, so omit for now, let's do it later.

--------------------------------------------------------------------------------

## API

Create aritical

URL /create/artical

Json return content object of the artical (this includes the aritical id)

```
{
    "articleid":__id__,
    "root":true,
    "kc":
    {
        "kctype":"container",
        "direction":"v",
        "items":[]
    }
}
```

--------------------------------------------------------------------------------

Render API:<br>
URL /render/aritcalid

Json return: content : HTML data to be displayed

--------------------------------------------------------------------------------

ADD API: URL /modify

Body

```
{
    "path":"path_to_element",
    "attributes":[__attr_array__],
    ...
}
```

Json return:

```
path      : input path
operation : Add
content   : Updated HTML data for the path block, shall append it.
```

Note we can not add element to template container, unless you create a new template. (which will be supported)

--------------------------------------------------------------------------------

Modify API: URL /modify

Body

```
{
    "path":"path_to_element",
    "attributes":[__attr_array__],
    ...
}
```

Json return:

```
path      : input path
operation : Update
content   : Updated HTML data for the path block, shall replace it.
```

--------------------------------------------------------------------------------

Delete API: URL /delete

Body

```
{
    "path":"path_to_element",
    ...
}
```

Json return:

```
path      : input path
operation : Delete
```

Note we can not delete part of template, unless you create a new template to do so. (which will be supported)

--------------------------------------------------------------------------------
