SELECT
  DISTINCT CASE
    WHEN art.ArticulationType = 1 THEN 'Course'
    ELSE 'Occupation'
  END AS 'ArticulationType',
  art.outline_id,
  art.AceID,
  art.TeamRevd,
  mco.Exhibit,
  mco.Occupation,
  mco.Title,
  art.ArticulationStatus,
  art.ArticulationStage,
  art.ArticulationType AS 'Type'
FROM
  Articulation AS art
  LEFT JOIN ACEExhibit AS mco ON art.AceID = mco.AceID
  AND art.TeamRevd = mco.TeamRevd
  LEFT JOIN CourseOccupations AS co ON mco.AceID = co.AceID
  AND mco.TeamRevd = co.TeamRevd
  LEFT JOIN View_MostCurrentOccupation AS vmco ON co.OccupationID = vmco.Occupation;