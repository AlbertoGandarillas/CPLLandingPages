SELECT
  va.articulationtype,
  cif.publishedcode,
  pc.outline_id,
  va.aceid,
  va.teamrevd,
  AE.exhibit,
  s.subject + ' ' + cif.course_number + ' - ' + cif.course_title AS CourseTitle,
  AE.occupation,
  va.title,
  v.lastname + ', ' + v.firstname AS Veteran,
  v.email,
  pif.program + ' - ' + CAST(pif.description AS VARCHAR(10)) AS program,
  CASE
    WHEN pc.group_desc <> '' THEN CAST(pc.group_units_min AS VARCHAR(4)) + ' - ' + CAST(pc.group_units_max AS VARCHAR(4))
    ELSE CAST(pc.vunits AS VARCHAR(4))
  END AS vunits,
  0 AS LeadID,
  pc.program_id,
  cif.college_id,
  v.id AS VeteranID
FROM
  (
    SELECT
      veteranid,
      aceid,
      teamrevd
    FROM
      veteranacecourse
    UNION
    SELECT
      veteranid,
      o.aceid,
      o.teamrevd
    FROM
      veteranoccupation AS vo
      JOIN aceexhibit AS o ON vo.occupationcode = o.occupation
    UNION
    SELECT
      v.id AS VeteranID,
      o.aceid,
      o.teamrevd
    FROM
      veteran AS v
      JOIN aceexhibit AS o ON v.occupation = o.occupation
  ) AS VE
  JOIN articulation AS va ON VE.aceid = VA.aceid
  AND VE.teamrevd = VA.teamrevd
  JOIN aceexhibit AS AE ON VA.aceid = AE.aceid
  AND VA.teamrevd = AE.teamrevd
  JOIN dbo.veteran AS v ON VE.veteranid = V.id
  JOIN dbo.tblprogramcourses AS pc ON va.outline_id = pc.outline_id
  JOIN dbo.course_issuedform AS cif ON pc.outline_id = cif.outline_id
  JOIN dbo.tblsubjects AS s ON cif.subject_id = s.subject_id
  JOIN dbo.program_issuedform AS pif ON pc.program_id = pif.program_id
  JOIN stages AS ST ON VA.articulationstage = ST.id
WHERE
  ST.[order] = 4;