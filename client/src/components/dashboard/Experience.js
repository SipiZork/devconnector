import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map(exp => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{exp.form}</Moment> - {
          exp.to === null ? ('Most') : (<Moment format='YYYY/MM/DD'>{exp.to}</Moment>)
        }
      </td>
      <td>
        <button onClick={() => deleteExperience(exp._id)} className='btn btn-danger'>Törlés</button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Igazolt tapasztalatok</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Cég</th>
            <th className="hide-sm">Munkakör</th>
            <th className="hide-sm">Évek</th>
            <th />
          </tr>
        </thead>
        <tbody>{ experiences }</tbody>
      </table>
    </Fragment>
  );
}

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
}

export default connect(null, { deleteExperience })(Experience);
