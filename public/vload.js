console.log ("vload.js is loaded");
let insert = document.querySelector("#insert");
insert.innerHTML = `
      <div class="intro">
        <h1>Vacancy Tracker</h1>
        <p><strong>The Chicago Teachers Union is fighting for the schools Chicago&rsquo;s students deserve.</strong> Chicago Public Schools CEO Pedro Martinez claims that the district has improved services by allocating new positions, but the reality is that many of these positions exist on paper only. See the difference between the staffing CPS <em>says</em> it is providing and the number of clinicians, teachers, teacher assistants and all school staff <em>actually working</em> at any given school, network office, citywide job category or throughout an elementary network region. These vacant position numbers were provided by CPS itself, so if you can either confirm or correct it, please click the appropriate button below the data table.</p>
      </div>
      <div id="text" class="text">
        <label for="cb1-input">Display data for:</label>
        <div class="combobox combobox-list">
          <div class="group">
            <input id="cb1-input" class="cb_edit" type="text" role="combobox" aria-autocomplete="both" aria-expanded="false" aria-controls="cb1-listbox">
            <button type="button" id="cb1-button" aria-label="Schools" aria-expanded="false" aria-controls="cb1-listbox" tabindex="-1">
              <svg width="18" height="16" aria-hidden="true" focusable="false" style="forced-color-adjust: auto">
                <polygon class="arrow" stroke-width="0" fill-opacity="0.75" fill="currentcolor" points="3,6 15,6 9,14"></polygon>
              </svg>
            </button>
          </div>
          <ul id="choiceList" role="listbox" aria-label="Schools">
          </ul>
        </div>
        <output for="cb1-input" id="dataOutput" class="dataOutput">
          <table id="0">
            <thead>
              <caption><div>Chicago Citywide Data</div></caption>
            </thead>
            <tbody>
            </tbody>
          </table>
        </output>
      </div>
      <figure id="cpsmap" class="cpsmap"></figure>
    </div>
`;

