const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route     GET api/profile/me
// @desc      Get current user profile
// @access    Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route     POST api/profile
// @desc      Create or update user profile
// @access    Private

router.post('/',
  [
    auth,
    [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skilles is required').not().isEmpty()
    ]
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
)

// @route     GET api/profile
// @desc      GET all profiles
// @access    Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route     GET api/profile/user/:user_id
// @desc      GET profile by user ID
// @access    Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    
    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectsId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route     DELETE api/profile
// @desc      Delete profile , user & posts
// @access    Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id});
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
        
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route     PUT api/profile/experience
// @desc      Add profile experience
// @access    Private
router.put('/experience', [ auth,
    [
      check('title', 'Title is reqired').not().isEmpty(),
      check('company', 'Company is reqired').not().isEmpty(),
      check('from', 'From date is reqired').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route     PUT api/profile/experience/update/:experience_id
// @desc      Update an experience
// @access    Private
router.post('/experience/update/:experience_id', [auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const updateExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }
    
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate({
        user: req.user.id, "experience._id": req.params.experience_id
      }, {
        $set: {
          "experience.$.title": updateExp.title,
          "experience.$.company": updateExp.company,
          "experience.$.location": updateExp.location,
          "experience.$.location": updateExp.location,
          "experience.$.from": updateExp.from,
          "experience.$.to": updateExp.to,
          "experience.$.description": updateExp.description,
        }
      }, { new: true });
        
      console.log("Itt vagyok még");
      res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);

// @route     DELETE api/profile/experience/delete/:experience_id
// @desc      Delete an experience from profile
// @access    Private
router.delete('/experience/delete/:experience_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.experience_id);
    profile.experience.splice(removeIndex, 1);
    
    await profile.save();

    res.json(profile);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route     PUT api/profile/education
// @desc      Add profile education
// @access    Private
router.put('/education', [ auth,
  [
    check('school', 'School is reqired').not().isEmpty(),
    check('degree', 'Degree is reqired').not().isEmpty(),
    check('fieldofstudy', 'Field of study is reqired').not().isEmpty(),
    check('from', 'From date is reqired').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newEdu);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);


// @route     PUT api/profile/education/update/:education_id
// @desc      Update an education
// @access    Private
router.post('/education/update/:education_id', [auth,
  [
    check('school', 'School is reqired').not().isEmpty(),
    check('degree', 'Degree is reqired').not().isEmpty(),
    check('fieldofstudy', 'Field of study is reqired').not().isEmpty(),
    check('from', 'From date is reqired').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const updateEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }
    
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate({
        user: req.user.id, "education._id": req.params.education_id
      }, {
        $set: {
          "education.$.school": updateEdu.school,
          "education.$.degree": updateEdu.degree,
          "education.$.fieldofstudy": updateEdu.fieldofstudy,
          "education.$.from": updateEdu.from,
          "education.$.to": updateEdu.to,
          "education.$.current": updateEdu.current,
          "education.$.description": updateEdu.description,
        }
      }, { new: true });

      res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);


// @route     DELETE api/profile/education/delete/:education_id
// @desc      Delete an education from profile
// @access    Private
router.delete('/education/delete/:education_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.education_id);
    profile.education.splice(removeIndex, 1);
    
    await profile.save();

    res.json(profile);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route     GET api/profile/github/:usernanme
// @desc      Get user repos from Github
// @access    Public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

module.exports = router;