SELECT
  ao.*
FROM
  AceCourseCatalog AS ao
  JOIN (
    SELECT
      AceID,
      max(EndDate) AS EndDate
    FROM
      AceCourseCatalog
    GROUP BY
      AceID
  ) AS maxend ON ao.AceID = maxend.AceID
  AND ao.EndDate = maxend.EndDate
  JOIN (
    SELECT
      AceID,
      max(StartDate) AS StartDate
    FROM
      AceCourseCatalog
    GROUP BY
      AceID
  ) AS maxstart ON ao.AceID = maxstart.AceID
  AND ao.StartDate = maxstart.StartDate;