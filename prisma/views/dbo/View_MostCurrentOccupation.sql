SELECT
  ao.*
FROM
  ACEExhibit AS ao
  JOIN (
    SELECT
      occupation,
      max(EndDate) AS EndDate
    FROM
      ACEExhibit
    GROUP BY
      Occupation
  ) AS maxend ON ao.Occupation = maxend.Occupation
  AND ao.EndDate = maxend.EndDate
  JOIN (
    SELECT
      occupation,
      max(StartDate) AS StartDate
    FROM
      ACEExhibit
    GROUP BY
      Occupation
  ) AS maxstart ON ao.Occupation = maxstart.Occupation
  AND ao.StartDate = maxstart.StartDate;