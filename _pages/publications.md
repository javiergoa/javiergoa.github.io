---
layout: page
permalink: /publications/
title: publications
years: [2023,2022,2021,2019]ls
nav: true
---

<div class="publications">

{% bibliography -f papers%}

</div>

{% comment %}
<h1>preprints</h1>

<div class="publications">

{% bibliography -f preprints %}

</div>


<div class="publications">

{% for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}
</div>
{% endcomment %}

<p>* = undergraduate collaborator</p>
