SELECT
  DISTINCT va.Occupation,
  cif.college_id
FROM
  dbo.ViewArticulations AS va
  JOIN dbo.Course_IssuedForm AS cif ON va.outline_id = cif.outline_id
WHERE
  va.[Type] = 2
  AND va.ArticulationStage IN (4, 8, 12);