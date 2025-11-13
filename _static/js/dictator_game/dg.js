(() => {
    if (window.__dg_loaded__) return;            // guard against double-load
    window.__dg_loaded__ = true;

    // ---------- DOM handles ----------
    const box       = document.getElementById('donationBox');
    const keepSpan  = document.getElementById('keepVal');
    const sponsorSpan = document.getElementById('sponsorVal');
    const youSpan     = document.getElementById('charityVal');

    // ---------- treatment flags ----------
    const flags       = document.getElementById('dg-data').dataset;
    const impactLevel = +flags.impactLevel;      // 0, 1, 2

    // ---------- live update ----------
    function update () {
        // clamp donation to 0–100
        let d = Math.max(0, Math.min(+box.value || 0, 100));
        box.value = d;                           // normalise field

        // own payoff
        keepSpan.textContent = `$${(1 - d/100).toFixed(2)}`;

        // decomposition of AMF money
        let sponsor = 1.00;                      // default lead donation
        let you     = 0.00;                      // default participant amount

        if (impactLevel === 1) {                 // IMPACT “adds”
            you = d / 100;
            // sponsor stays 1.00
        } else if (impactLevel === 0) {          // IMPACT “crowd-out”
            sponsor = 1 - d / 100;               // he withdraws 1-for-1
            you     = d / 100;
        } /* impactLevel === 2 (“burn”): sponsor 1.00, you 0.00 */

        sponsorSpan.textContent = `$${sponsor.toFixed(2)}`;
        youSpan.textContent     = `$${you.toFixed(2)}`;
    }

    // initialise + attach listener
    update();
    box.addEventListener('input', update);
})();