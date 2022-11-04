/**
 * @name widen.js
 * @description Basic, standalone widget for utilizing the Widen API to 
 *              render a grouping of literature assets (commonly links to
 *              PDFs with previews).
 * @example HTML markup.
 * 
 * <div 
 *   class="digital-vault"
 *   data-endpoint="assets/search"
 *   data-query="acn:{ThermaTru Product Literature}"
 *   data-expand="embeds,metadata,thumbnails"
 *   data-limit="100"
 *   data-scroll="true"
 *   data-sort="-last_update_date"
 * ></div>
 * <script src="widen.js" async defer></script>
 * 
 * @todo Create a server-side wrapper for the authentication credentials.
 * @todo Use searchParams to build the endpoint URL, it just feels more 
 *       right, not sure if it matters though.
 * @todo Package with basic CSS, include all the trimmings of a modern
 *       javascript package.
 * @todo Include a preload state for the entire script and individually
 *       lazy loaded images.
 * @todo Pull out HTML templates to allow for i18n.
 * @todo Expose an object and allow use as a frontend module.
 */
 (function() {

    "use strict";
  
      // Set some constants upfront for ease of access.
      const settings = {
          vaultInstances: document.querySelectorAll(".digital-vault"),
          cacheExpiry: 30 * 60 // 30 minutes.
    };
  
      // Run init on our vaultInstances.
      settings.vaultInstances.forEach(vaultInstance => init(vaultInstance));
  
  
  
      /**
       * @function init()
       * @description Takes an HTMLElement and inserts HTML either containing literatureItems from the Widen API or errorMessage.
       * @param {HTMLElement} vaultInstance Element where HTML will be inserted.
       */
  
      function init(vaultInstance) {
  
          // Assemble our full Widen endpoint URL.
      const endpointUrl = 
              `https://us-central1-widenapi.cloudfunctions.net/DV/https:/api.widencollective.com/v2/${vaultInstance.dataset.endpoint}` +
              `?query=${vaultInstance.dataset.query}` +
              `&expand=${vaultInstance.dataset.expand}` +
              `&limit=${vaultInstance.dataset.limit}` +
              `&scroll=${vaultInstance.dataset.scroll}` +
              // If we're sorting by a meta field, we do our sort inside the fetch rather than relying on the API.
              `&sort=${vaultInstance.dataset.sort == 'meta' ? "" : vaultInstance.dataset.sort}`;
              
  
          // Set our request payload.
          const requestOptions = {
              headers: {
                  "Access-Control-Allow-Origin": "*"
              },
              method: "GET",
              redirect: "follow"
          };
  
          // Set some easy-access variables for our caching mechanism.
          const cached = localStorage.getItem(endpointUrl),
                whenCached = localStorage.getItem(endpointUrl + ':ts'),
                    cacheAge = (Date.now() - whenCached) / 1000;
  
          // If we have a cached version, use it.
          if (cached !== null && whenCached !== null) {
  
              // Check the age of the cache to make sure it's not too stale.
              if (cacheAge < settings.cacheExpiry) {
                  renderHTML(JSON.parse(cached));
              } else {
                  // Clear the cache if it's stale.
                  localStorage.removeItem(endpointUrl)
                  localStorage.removeItem(endpointUrl + ':ts')
              }
          
          // Else, query the API and grab the data for rendering/caching.
          } else {
              // Fetch using our assembled endpoint URL and request payload.
              fetch(endpointUrl, requestOptions)
              .then(response => response.json())
              .then(function(response) {
                  localStorage.setItem(endpointUrl, JSON.stringify(response));
                  localStorage.setItem(endpointUrl + ':ts', Date.now());
                  renderHTML(response);
              })
              // Catch the native error and send it to errorMessage.
              .catch(error => errorMessage(error, vaultInstance));
          }
  
          // This function renders the HTML in the above and does whatever custom sorting we want.
          function renderHTML(response) {
              // Check if a count greater than 0 is returned. If not, return an error message.
  
              if (response["total_count"] > 0) {
  
                  var items = response.items;
          
                  // Do whatever custom sorting we'd like.
                  if (vaultInstance.dataset.sort == 'meta') {
                      // Sort via our meta field, which should always be collectionOrder.
                      items.sort(function(a, b){
                          return a.metadata.fields.collectionOrder[0] - b.metadata.fields.collectionOrder[0];
                      });
                  }
                  items.forEach(item => literatureItems(item, vaultInstance));
              } else {
                  errorMessage("", vaultInstance);
              }
          }
      }
  
    /**
       * @function errorMessage()
       * @description Inserts error HTML in the provided HTMLElement.
       * @param {String} error Error message.
       * @param {HTMLElement} vaultInstance Element where HTML will be inserted.
       */
  
      function errorMessage(error, vaultInstance){
          
          // Define HTML with template literals.
          const template = `
            <div class="alert alert-danger" role="alert">
                  <h3>This literature is currently not available.</h3>
                  <p>Login to the <a href="https://thermatru.widencollective.com/login">
                  ThermaTru Digital Vault</a>, or please <a href="/pages/contact-us">contact support</a>.</p>
                  ${error ? `<code>${error}</code>` : ""}
              </div>
          `;
  
          // Append HTML on element.
          vaultInstance.insertAdjacentHTML("beforeEnd", template);
      }
  
      /**
       * @function literatureItems()
       * @description Inserts asset HTML using the JSON data returned from the Widen API in the provided HTMLElement.
       * @param {JSON} item JSON array containing asset-level data returned from the Widen API.
       * @param {HTMLElement} vaultInstance Element where HTML will be inserted.
       */
  
      function literatureItems(item, vaultInstance){
  
          // Set some variables for ease of access.
          let thumbnail   = item.embeds.document_thumbnail.url,
                description = item.metadata.fields.description[0],
              downloadUrl = item.embeds.document_viewer_with_download.url,
                altUrl      = item.metadata.fields.alternateAsset[0];
  
          // Define HTML with template literals.
          const template = `
              <div class="lit-block">
                  <div class="lit-feature">
                      <div class="lit-img-block">
                          <a href="${altUrl ? altUrl : downloadUrl}" target="_blank">
                              <img src="${thumbnail}" alt="${description}" loading="lazy" />
                          </a>
                      </div>
                      <div class="caption-block">
                          <h2>${description}</h2>
                          <a class="fypon-btn" href="${altUrl ? altUrl : downloadUrl}" target="_blank">View Literature</a>
                      </div>
                  </div>
              </div>
          `;
  
          // Append HTML on element.
          vaultInstance.insertAdjacentHTML("beforeEnd", template);
    }  
      
  })();