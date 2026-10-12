import React from "react";

/**
 * IPA phonetic pronunciation display section for WordLookupPopover.
 */
export const PopoverIpaSection = ({
  loading = false,
  cleanWord = "",
  lookupData = null,
}) => {
  if (!loading && !lookupData?.ipa_uk && !lookupData?.ipa_us && !lookupData?.ipa) {
    return null;
  }

  return (
    <>
      <div className="lookup-section">
        <div className="lookup-section-title">IPA for {cleanWord}</div>
        {loading ? (
          <div className="lookup-skeleton-line" style={{ width: "65%" }} />
        ) : (
          <div className="lookup-ipa-row">
            {lookupData?.ipa_uk && lookupData?.ipa_us && lookupData.ipa_uk !== lookupData.ipa_us ? (
              <>
                <span className="ipa-accent">UK</span>
                <span className="ipa-text">{lookupData.ipa_uk}</span>
                <span className="ipa-accent" style={{ marginLeft: "10px" }}>
                  US
                </span>
                <span className="ipa-text">{lookupData.ipa_us}</span>
              </>
            ) : (
              <>
                <span className="ipa-accent">UK • US</span>
                <span className="ipa-text">
                  {lookupData?.ipa_uk || lookupData?.ipa_us || lookupData?.ipa || "/.../"}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="lookup-divider" />
    </>
  );
};
