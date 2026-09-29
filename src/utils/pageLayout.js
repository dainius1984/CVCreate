export const getProtectedPageRanges = (contentElement, scaleY = 1) => {
  const contentTop = contentElement.getBoundingClientRect().top;
  const ranges = [];
  const rangeFor = (element) => {
    const rect = element.getBoundingClientRect();
    return [
      Math.round((rect.top - contentTop) * scaleY),
      Math.round((rect.bottom - contentTop) * scaleY)
    ];
  };
  const addRange = (start, end) => {
    if (end > start) ranges.push([start, end]);
  };

  const experienceHeading = contentElement.querySelector('[data-section="experience-header"]');
  const firstEntryHeading = contentElement.querySelector('[data-section="experience-entry-header-0"]');
  const firstResponsibility = contentElement.querySelector('[data-section="experience-0"] [data-break]');
  if (experienceHeading && firstEntryHeading) {
    const headingRange = rangeFor(experienceHeading);
    const firstEntryRange = rangeFor(firstResponsibility || firstEntryHeading);
    addRange(headingRange[0], firstEntryRange[1]);
  }

  contentElement.querySelectorAll(
    '[data-section^="experience-entry-header-"], [data-break], [data-section="skills"], [data-section^="skill-item-"]'
  ).forEach((element) => addRange(...rangeFor(element)));

  return ranges.sort((a, b) => a[0] - b[0]);
};

export const getPageBreaks = (totalHeight, pageHeight, protectedRanges) => {
  const breaks = [];
  const minSlice = pageHeight * 0.5;
  let sourceY = 0;

  while (sourceY + pageHeight < totalHeight) {
    const proposedEnd = sourceY + pageHeight;
    let endY = proposedEnd;

    for (const [rangeStart, rangeEnd] of protectedRanges) {
      if (proposedEnd <= rangeStart || proposedEnd >= rangeEnd) continue;

      const beforeRange = rangeStart - sourceY;
      const afterRange = rangeEnd - sourceY;
      if (beforeRange >= minSlice) {
        endY = rangeStart;
      } else if (afterRange <= pageHeight) {
        endY = rangeEnd;
      }
      break;
    }

    if (endY <= sourceY) endY = proposedEnd;
    breaks.push(endY);
    sourceY = endY;
  }

  return breaks;
};