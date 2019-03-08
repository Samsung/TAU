# Changing Pages
With TAU library, we can change page by method *changePage*.

The following table lists the methods you can use to change the active page.

When you want to change pages with TAU, *DO NOT USE* _location.href_ or
 _location.replace. TAU have self-method of managing histories. But when you
 use above methods, it would lead to confusion. If you want to change pages,
 you can use _tau.changePage()_ and _tau.back()_.
 ## Page changing methods
 ### Summary
<table class="informaltable">
<thead>
<tr>
<th>Method</th>
<th>Description</th>
</tr>
</thead>
<tbody>


<tr>
<td>
<pre class="intable prettyprint"><a href="#method-changePage">tau.changePage</a> (toPage, options) </pre>
</td>
<td><p>Programmatically change to another page. The <span style="font-family: Courier New,Courier,monospace">to</span> argument is a page object or string.</p></td>
</tr>



<tr>
<td>
<pre class="intable prettyprint"><a href="#method-back">tau.back</a> (  ) </pre>
</td>
<td><p>Loads the previous page in the history list.</p></td>
</tr>
</tbody>
</table>

<dt class="method" id="addidp28072"><code><b><span class="methodName"
id="method-changePage">tau.changePage</span></b></code></dt>
<dd>
<div class="brief">
<p>Programmatically change to another page.</p>
</div>
<div class="synopsis">
<pre class="signature prettyprint">tau.changePage (toPage, options) </pre>
</div>

<div class="description">
<p>

</p>
</div>

<div class="parameters">
<p><span class="param">Parameters:</span></p>
<table>
<tbody>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required / optional</th>
<th>Description</th>
</tr>


<tr>
<td><span style="font-family: Courier New,Courier,monospace">toPage</span></td>
<td>HTMLElement | string</td>
<td>required</td>
<td>page to move <br>HTML element or relative url of page.</td>
</tr>

<tr>
<td><span style="font-family: Courier New,Courier,monospace">options</span></td>
<td>Object</td>
<td>optional</td>
<td>options to change pages.</td>
</tr>
</tbody>
</table></div>

<div class="parameters">
<p><span class="param">Options for changePage():</span></p>
<table>
<tbody>
<tr>
<th>option</th>
<th>Type</th>
<th>value</th>
<th>Description</th>
</tr>


<tr>
<td><span style="font-family: Courier New,Courier,monospace">transition</span></td>
<td>string</td>
<td>'sequential' | 'simultaneous' | 'flip' |'depth' | 'pop' | 'slide' |'turn'</td>
<td>transition for opening page</td>
</tr>

<tr>
<td><span style="font-family: Courier New,Courier,monospace">reverse</span></td>
<td>boolean</td>
<td>true | false</td>
<td>true, if transition should be reversed</td>
</tr>
</tbody>
</table></div>

<div class="example">
<span class="example"><p>Code
example (using HTML Element):</p><p></p></span>
<pre name="code" class="examplecode
prettyprint">
&lt;div data-role=&quot;page&quot; id=&quot;main&quot;&gt;...&lt;/div&gt;
&lt;script&gt;
var element = document.getElementById("main");
tau.changePage(element, {transition:'flip',reverse:false});
&lt;/script&gt;
</pre>
</div>

<div class="example">
<span class="example"><p>Code
example2 (using url string):</p><p></p></span>
<pre name="code" class="examplecode
prettyprint">
 // This is "index.html" and if there is "subPage.html" in same directory.
&lt;script&gt;
tau.changePage("subPage.html");
&lt;/script&gt;
</pre>
</div>


</dd>


<dt class="method" id="addidp28072"><code><b><span class="methodName"
id="method-back">back</span></b></code></dt>
<dd>
<div class="brief">
<p>Loads the previous page in the history list.</p>
</div>
<div class="synopsis">
<pre class="signature prettyprint">back ( ) </pre>
</div>

<div class="description">
<p>
<b>Same as:</b> window.history.back()
</p>
</div>



<div class="example">
<span class="example"><p>Code
example:</p><p></p></span>
<pre name="code" class="examplecode
prettyprint">
&lt;script&gt;
tau.back();
&lt;/script&gt;
</pre>
</div>


</dd>