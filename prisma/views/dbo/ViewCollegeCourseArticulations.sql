SELECT
  ac.outline_id,
  subject + ' ' + ci.course_number AS Course,
  ci.Course_title AS CourseTitle,
  AceId,
  Title AS ACECourseTitle,
  TeamRevd,
  CASE
    WHEN ac.ArticulationStatus = 1 THEN 'Stagging'
    WHEN ac.ArticulationStatus = 2 THEN 'Published'
  END AS ArticulationStatus,
  '' AS MOS,
  'Course' AS ArticulationType
FROM
  articulationcourse AS ac
  JOIN course_issuedform AS ci ON ac.outline_id = ci.outline_id
  JOIN tblsubjects AS s ON ci.subject_id = s.subject_id
WHERE
  articulationstage = 4
  AND ac.articulationstatus IN (1, 2)
UNION
ALL
SELECT
  co.outline_id,
  subject + ' ' + ci.course_number AS Course,
  ci.Course_title AS CourseTitle,
  co.AceId,
  co.Title AS ACECourseTitle,
  co.TeamRevd,
  CASE
    WHEN co.ArticulationStatus = 1 THEN 'Stagging'
    WHEN co.ArticulationStatus = 2 THEN 'Published'
  END AS ArticulationStatus,
  occupation AS MOS,
  'Occupation' AS ArticulationType
FROM
  collegecourseoccupations AS co
  JOIN course_issuedform AS ci ON co.outline_id = ci.outline_id
  JOIN tblsubjects AS s ON ci.subject_id = s.subject_id
  JOIN aceoccupation AS aoc ON co.aceid = aoc.aceid
  AND co.teamrevd = aoc.teamrevd
WHERE
  articulationstage = 4
  AND co.articulationstatus IN (1, 2);