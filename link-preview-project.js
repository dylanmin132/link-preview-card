/**
 * Copyright 2025 dylanmin132
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-project`
 * 
 * @demo index.html
 * @element link-preview-project
 */
export class LinkPreviewProject extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "link-preview-project";
  }

constructor() {
  super();
  this.title="";
  this.href="";
  this.desc="";
  this.img="";
  this.link="";
  this.theme="";
  this.isLoading=false;

  this.registerLocalization({
    context: this,
    localesPath:
      new URL("./locales/link-preview.ar.json", import.meta.url).href +
      "/../"
  });
}

static get properties() {
  return{
    ...super.properties,
    title: {type: String},
    href: {type: String},
    desc: {type: String},
    img: {type: String},
    link:{type: String},
    theme: {type: String},
    isLoading: {type: Boolean, reflect: true, attribute: "isLoading"},
  };
}

static get styles() {
  return[super.styles,
  css`
    :host {
        display: block;
        color: var(--themeColor);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        border-radius: var(--ddd-radius-sm);
        padding: var(--ddd-spacing-3);
        max-width: 400px;
        border: var(--ddd-border-sm);
        border-color: var(--themeColor);
      }

      :host(:hover) {
        transform: translateY(-5px);
      }

      .preview {
        display: flex;
        flex-direction: column;
        text-align: center;
      }

      img {
        display: block;
        height: auto;
        max-width: 80%;
        margin: var(--ddd-spacing-0) auto;
        border-radius: var(--ddd-radius-sm);
        border: var(--ddd-border-lg);
        border-color: var(--themeColor);
      }

      .content {
        margin-top: var(--ddd-spacing-3);
        padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
      }
      
      .title {
        font-weight: var(--ddd-font-weight-bold);
        font-size: var(--ddd-font-size-s);
        margin: var(--ddd-spacing-4) var(--ddd-spacing-0);
        color: var(--themeColor);
      }

      details {
      border: var(--ddd-border-sm);
      border-color: var(--themeColor);
      border-radius: var(--ddd-radius-sm);
      text-align: center;
      padding: var(--ddd-spacing-2);
      height: 70px;
      overflow: auto;
      }

      details summary {
        text-align: center;
        font-size: var(--ddd-font-size-3xs);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-0);
      }

      .desc {
        font-size: var(--ddd-font-size-3xs);
        color: var(--ddd-theme-default-white);
        margin: var(--ddd-spacing-2) var(--ddd-spacing-0);
      }

      .url {
        display: inline-block;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        margin: var(--ddd-spacing-2) auto;
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-white);
        border: var(--ddd-border-sm);
        border-color: var(--themeColor);
        border-radius: var(--ddd-radius-sm);
        transition: background-color 0.3s ease-in-out;
      }

      .url:hover {
        background-color: var(--themeColor);
      }

      .loading-spinner {
        margin: var(--ddd-spacing-5) auto;
        border: var(--ddd-border-lg);
        border-color: var(--ddd-theme-default-white);
        border-top: var(--ddd-border-lg);
        border-top-color: var(--ddd-theme-default-skyBlue);
        border-radius: var(--ddd-radius-xl);
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 600px) {
        :host {
          max-width: 100%;
          padding: var(--ddd-spacing-3);
        }
      }
  
  `];
}

updated(changesProperties){
  if(changesProperties.has("href") && this.href){
    this.fetchData(this.href);
  }
}

async fetchData(link) {
  this.isLoading=true;
  const url=`https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
  try {
    const response=await fetch(url);
    if(!response.ok){
      throw new Error(`Response Status: ${response.status}`);
    }
  
    const json=await response.json();
    console.log(json);

    this.title=json.data["title"] || "Title not available";
    this.desc=json.data["desc"] || "Description not available";
    this.img=json.data["image"] || json.data["logo"] || json.data["og:image"];
    this.link=json.data["url"] || link;
    this.theme=json.data["theme-color"] || this.defTheme();
    } catch (error) {
      console.error(error);
      this.title="No prvw available";
      this.desc="";
      this.img="image not available";
      this.link="";
      this.theme=this.defTheme();
    }finally{
      this.isLoading = false;
    }
  }

  defTheme() {
    if(this.href.includes("psu")){
      return "var(--ddd-primary-1)";
    }
    else{
      return "var(--ddd-primary-8)";
    }
  }
  

    imgHandler() 
    {
      this.img="";
      this.requestUpdate();
    }

    render() {
      return html`
        <div class="preview" style="--theme: ${this.theme}" part="preview">
          ${this.isLoading
            ? html`<div class="loader" part="loader"></div>`
              : html`
                ${this.img ? html`<img src="${this.img}" alt="" @error="${this.imgHandler}" part="image" />` : ''}
                  <div class="content" part="content">
                    <h2 class="title" part="title">${this.title}</h2>
                      <details part="details">
                        <summary part="summary">Description</summary>
                          <p class="desc" part="desc">${this.desc}</p>
                        </details>
                      <a href="${this.link}" target="_blank" class="url" part="url">Link to Site</a>
                    </div>
                  `}
                </div>
              `;
            }

    static get haxProperties() {
      return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
    }
  }
  globalThis.customElements.define(LinkPreviewProject.tag, LinkPreviewProject);