import PropTypes from 'prop-types';

export default function Resume({ userData }) {
  return (
    <div className="mx-auto bg-white shadow-lg rounded-lg p-6 mt-5 fontColor">
      {userData.spanResume && (
        <div className="text-red-600 font-bold text-lg mb-4">⚠️ This resume may be spam or incomplete</div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
      {Object.entries(userData.personal_info).map(([key, value], index) => (
        value ? <p key={index}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p> : null
      ))}

      {userData.education?.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Education</h2>
          {userData.education.map((edu, index) => (
            <div key={index} className="mt-2">
              {Object.entries(edu).map(([key, value]) => (
                <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
              ))}
            </div>
          ))}
        </>
      )}

      {userData.work_experience?.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Work Experience</h2>
          {userData.work_experience.map((job, index) => (
            <div key={index} className="mt-2">
              <p><strong>Job Title:</strong> {job.job_title}</p>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Duration:</strong> {job.duration}</p>
              {job.responsibilities?.length > 0 && (
                <>
                  <strong>Responsibilities:</strong>
                  <ul className="list-disc list-inside">
                    {job.responsibilities.map((res, i) => <li key={i}>{res}</li>)}
                  </ul>
                </>
              )}
            </div>
          ))}
        </>
      )}

      {userData.skills && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Skills</h2>
          <p><strong>Technical:</strong> {userData.skills.technical.join(', ')}</p>
          {userData.skills.soft?.length > 0 && <p><strong>Soft:</strong> {userData.skills.soft.join(', ')}</p>}
        </>
      )}

      {userData.certifications?.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Certifications</h2>
          {userData.certifications.map((cert, index) => (
            <div key={index}>
              <p><strong>Name:</strong> {cert.name}</p>
              <p><strong>Issuer:</strong> {cert.issuer}</p>
              <p><strong>Year:</strong> {cert.year || 'N/A'}</p>
            </div>
          ))}
        </>
      )}

      {userData.projects?.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Projects</h2>
          {userData.projects.map((project, index) => (
            <div key={index} className="mt-2">
              <p><strong>Title:</strong> {project.title}</p>
              <p><strong>Technology:</strong> {Array.isArray(project.technology) ? project.technology.join(', ') : project.technology}</p>
              <p><strong>Time Period:</strong> {project.time_period || 'N/A'}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

Resume.propTypes = {
  userData: PropTypes.shape({
    personal_info: PropTypes.object.isRequired,
    education: PropTypes.arrayOf(PropTypes.object).isRequired,
    work_experience: PropTypes.arrayOf(PropTypes.object).isRequired,
    skills: PropTypes.shape({
      technical: PropTypes.arrayOf(PropTypes.string).isRequired,
      soft: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    certifications: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        issuer: PropTypes.string,
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.oneOf([null])])
      })
    ).isRequired,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        technology: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        time_period: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])])
      })
    ).isRequired,
    spam: PropTypes.bool.isRequired
  }).isRequired
};
