// GigHub - Student Gig Platform
// ================================

class GigHubApp {
  constructor() {
    this.currentUser = null
    this.gigs = []
    this.bids = []
    this.portfolio = []
    this.init()
  }

  init() {
    this.loadFromStorage()
    this.setupFirebaseAuth()
    this.render()
    this.attachEventListeners()

    // Load initial gigs
    if (this.gigs.length === 0) {
      this.generateSampleGigs()
    }
  }

  setupFirebaseAuth() {
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        this.currentUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          rating: 4.8,
          completedTasks: 12,
          earnings: 450,
          bio: "Motivated student passionate about helping others!",
        }
        this.loadUserData()
      } else {
        // User is signed out
        this.currentUser = null
      }
      this.render()
    })
  }

  loadFromStorage() {
    const saved = localStorage.getItem("gighub-data")
    if (saved) {
      const data = JSON.parse(saved)
      this.gigs = data.gigs || []
      this.bids = data.bids || []
      this.portfolio = data.portfolio || []
    }
  }

  loadUserData() {
    const saved = localStorage.getItem(`gighub-user-${this.currentUser.id}`)
    if (saved) {
      const userData = JSON.parse(saved)
      this.currentUser.rating = userData.rating || 4.8
      this.currentUser.completedTasks = userData.completedTasks || 0
      this.currentUser.earnings = userData.earnings || 0
      this.currentUser.bio = userData.bio || "Motivated student passionate about helping others!"
      this.portfolio = userData.portfolio || []
    }
  }

  saveToStorage() {
    localStorage.setItem(
      "gighub-data",
      JSON.stringify({
        gigs: this.gigs,
        bids: this.bids,
      }),
    )
    
    // Save user-specific data
    if (this.currentUser) {
      localStorage.setItem(
        `gighub-user-${this.currentUser.id}`,
        JSON.stringify({
          rating: this.currentUser.rating,
          completedTasks: this.currentUser.completedTasks,
          earnings: this.currentUser.earnings,
          bio: this.currentUser.bio,
          portfolio: this.portfolio,
        })
      )
    }
  }

  generateSampleGigs() {
    const sampleGigs = [
      {
        id: 1,
        title: "Design Instagram Post",
        description: "Need 5 Instagram posts designed for a student-run coffee shop",
        skill: "design",
        pay: 50,
        time: "2 hours",
        location: "remote",
        deadline: "2 days",
        bids: [{ id: 1, author: "Alex Design", amount: 45, time: "1.5 hours", rating: 5 }],
      },
      {
        id: 2,
        title: "Essay Editing & Proofreading",
        description: "Need help editing a 3000-word essay on climate change",
        skill: "writing",
        pay: 30,
        time: "1 hour",
        location: "remote",
        deadline: "Tonight",
        bids: [],
      },
      {
        id: 3,
        title: "Calculus Tutoring Session",
        description: "Help studying for calculus midterm - integrals & derivatives",
        skill: "tutoring",
        pay: 25,
        time: "1 hour",
        location: "campus",
        deadline: "Today",
        bids: [],
      },
      {
        id: 4,
        title: "Web App Backend Setup",
        description: "Set up Node.js backend with MongoDB for my project",
        skill: "tech",
        pay: 80,
        time: "3 hours",
        location: "remote",
        deadline: "3 days",
        bids: [],
      },
      {
        id: 5,
        title: "Create Presentation Slides",
        description: "Design 20 slides for business presentation with graphics",
        skill: "design",
        pay: 40,
        time: "2 hours",
        location: "remote",
        deadline: "Tomorrow",
        bids: [],
      },
      {
        id: 6,
        title: "Python Homework Help",
        description: "Debug and fix Python code for data structures project",
        skill: "tech",
        pay: 35,
        time: "1.5 hours",
        location: "remote",
        deadline: "2 days",
        bids: [],
      },
    ]

    this.gigs = sampleGigs
    this.saveToStorage()
  }

  // Firebase Auth Methods
  async login(email, password) {
    try {
      console.log('Attempting login with:', email)
      const result = await auth.signInWithEmailAndPassword(email, password)
      console.log('Login successful:', result.user)
    } catch (error) {
      console.error('Login error:', error.code, error.message)
      this.showAuthError(error.message)
    }
  }

  async signup(email, password, name) {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password)
      // Update display name
      await result.user.updateProfile({ displayName: name })
      console.log('Signup successful:', result.user)
    } catch (error) {
      console.error('Signup error:', error)
      this.showAuthError(error.message)
    }
  }

  logout() {
    auth.signOut().then(() => {
      console.log('Logout successful')
    }).catch((error) => {
      console.error('Logout error:', error)
    })
  }

  showAuthError(message) {
    if (message.includes('too-many-requests')) {
      alert('⏰ Too many login attempts. Please wait 15-30 minutes and try again.')
    } else if (message.includes('invalid-credential')) {
      alert('❌ Invalid email or password. Try creating an account first.')
    } else {
      alert(`Authentication Error: ${message}`)
    }
  }

  // Gig Methods
  createGig(gigData) {
    const newGig = {
      id: Date.now(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      ...gigData,
      bids: [],
      status: "open",
    }
    this.gigs.push(newGig)
    this.saveToStorage()
    return newGig
  }

  submitBid(gigId, amount, deliveryTime) {
    const gig = this.gigs.find((g) => g.id === gigId)
    if (gig) {
      const bid = {
        id: Date.now(),
        author: this.currentUser.name,
        userId: this.currentUser.id,
        amount,
        time: deliveryTime,
        rating: 4.5,
        timestamp: new Date().toLocaleString(),
      }
      gig.bids.push(bid)
      this.saveToStorage()
      return bid
    }
  }

  acceptBid(gigId, bidId) {
    const gig = this.gigs.find((g) => g.id === gigId)
    const bid = gig.bids.find((b) => b.id === bidId)

    if (gig && bid) {
      // Check if current user is the gig owner
      if (gig.userId !== this.currentUser.id) {
        alert('You can only accept bids for your own gigs!')
        return
      }

      // Add completed project to the bid winner's portfolio (not the gig owner)
      this.portfolio.push({
        id: Date.now(),
        userId: bid.userId,
        gigId,
        title: gig.title,
        skill: gig.skill,
        amount: bid.amount,
        completedDate: new Date().toLocaleDateString(),
        rating: 5,
        description: gig.description,
      })

      gig.status = "completed"
      this.saveToStorage()
    }
  }

  // Gig Management Methods
  editGig(gigId, gigData) {
    const gig = this.gigs.find((g) => g.id === gigId)
    if (gig && gig.userId === this.currentUser.id) {
      Object.assign(gig, gigData)
      this.saveToStorage()
      this.render()
      return true
    }
    return false
  }

  deleteGig(gigId) {
    const gigIndex = this.gigs.findIndex((g) => g.id === gigId)
    if (gigIndex !== -1 && this.gigs[gigIndex].userId === this.currentUser.id) {
      this.gigs.splice(gigIndex, 1)
      this.saveToStorage()
      this.render()
      return true
    }
    return false
  }

  // Filter Methods
  filterGigs(filters) {
    return this.gigs.filter((gig) => {
      let matches = true

      if (filters.skill && gig.skill !== filters.skill) matches = false
      if (filters.location && gig.location !== filters.location) matches = false
      if (filters.search) {
        const query = filters.search.toLowerCase()
        if (!gig.title.toLowerCase().includes(query) && !gig.description.toLowerCase().includes(query)) {
          matches = false
        }
      }

      return matches
    })
  }

  // Render Methods
  render() {
    const app = document.getElementById("app")

    if (!this.currentUser) {
      app.innerHTML = this.renderAuth()
    } else {
      app.innerHTML = this.renderDashboard()
    }

    this.attachEventListeners()
  }

  renderAuth() {
    return `
            <div class="auth-container">
                <div class="auth-form">
                    <h1>Welcome to GigHub</h1>
                    <p class="subtitle">Find or post gigs. Build your portfolio.</p>
                    
                    <div id="login-form">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="login-email" placeholder="your.email@university.edu">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="login-password" placeholder="••••••••">
                        </div>
                        <button class="btn btn-primary btn-full" onclick="app.handleLogin()">Sign In</button>
                        <p class="toggle-link">New here? <a onclick="app.toggleAuthForm()">Create account</a></p>
                    </div>

                    <div id="signup-form" style="display: none;">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="signup-name" placeholder="Your Name">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="signup-email" placeholder="your.email@university.edu">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="signup-password" placeholder="••••••••">
                        </div>
                        <button class="btn btn-primary btn-full" onclick="app.handleSignup()">Create Account</button>
                        <p class="toggle-link">Already have an account? <a onclick="app.toggleAuthForm()">Sign in</a></p>
                    </div>
                </div>
            </div>
        `
  }

  renderDashboard() {
    return `
            <nav>
                <div class="container flex-between">
                    <a class="logo">⚡ GigHub</a>
                    <ul class="nav-links">
                        <li><a onclick="app.switchSection('feed')" class="nav-link ${this.getActiveSection() === "feed" ? "active" : ""}">Browse Gigs</a></li>
                        <li><a onclick="app.switchSection('posted')" class="nav-link ${this.getActiveSection() === "posted" ? "active" : ""}">My Gigs</a></li>
                        <li><a onclick="app.switchSection('profile')" class="nav-link ${this.getActiveSection() === "profile" ? "active" : ""}">Profile</a></li>
                        <li><a onclick="app.logout()" class="nav-link">Logout</a></li>
                    </ul>
                </div>
            </nav>

            <div class="dashboard">
                <div class="container">
                    <div id="feed" class="section active">
                        ${this.renderFeed()}
                    </div>
                    <div id="posted" class="section">
                        ${this.renderPostedGigs()}
                    </div>
                    <div id="profile" class="section">
                        ${this.renderProfile()}
                    </div>
                </div>
            </div>

            <div id="modal-overlay" class="modal-overlay">
                <div class="modal" id="modal-content"></div>
            </div>
        `
  }

  renderFeed() {
    return `
            <div class="gig-board">
                <h2 style="margin-bottom: 24px;">Available Gigs</h2>
                
                <div class="filters">
                    <div class="form-group">
                        <label>Search</label>
                        <input type="text" id="search-input" placeholder="Search gigs..." onkeyup="app.updateFilters()">
                    </div>
                    <div class="form-group">
                        <label>Skill Type</label>
                        <select id="skill-filter" onchange="app.updateFilters()">
                            <option value="">All Skills</option>
                            <option value="design">Design</option>
                            <option value="writing">Writing</option>
                            <option value="tutoring">Tutoring</option>
                            <option value="tech">Tech</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <select id="location-filter" onchange="app.updateFilters()">
                            <option value="">Any Location</option>
                            <option value="remote">Remote</option>
                            <option value="campus">On Campus</option>
                        </select>
                    </div>
                    <div class="form-group flex flex-col justify-center">
                        <button class="btn btn-primary" onclick="app.openPostGigModal()" style="margin-top: 24px;">+ Post a Gig</button>
                    </div>
                </div>

                <div class="grid grid-cols-2" id="gigs-container">
                    ${this.renderGigsList()}
                </div>
            </div>
        `
  }

  renderGigsList() {
    const filters = {
      skill: document.getElementById("skill-filter")?.value || "",
      location: document.getElementById("location-filter")?.value || "",
      search: document.getElementById("search-input")?.value || "",
    }

    const filteredGigs = this.filterGigs(filters)

    if (filteredGigs.length === 0) {
      return `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>No gigs found</h3>
                    <p>Try adjusting your filters or check back later</p>
                </div>
            `
    }

    return filteredGigs
      .map(
        (gig) => `
            <div class="card gig-card" onclick="app.openGigDetails(${gig.id})">
                <div class="gig-info">
                    <div class="gig-title">${gig.title}</div>
                    <p class="text-sm" style="color: var(--text-secondary); margin-bottom: 12px;">${gig.description}</p>
                    
                    <div class="gig-meta">
                        <span class="tag">📚 ${gig.skill}</span>
                        <span class="tag">⏱️ ${gig.time}</span>
                        <span class="tag">${gig.location === "remote" ? "💻" : "📍"} ${gig.location}</span>
                    </div>
                </div>
                
                <div class="price">$${gig.pay}</div>
                <p class="text-sm text-secondary">Due: ${gig.deadline}</p>
                
                        <div class="gig-footer">
                            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.openGigDetails(${gig.id})">View & Bid</button>
                            ${gig.bids.length > 0 ? `<span class="text-sm text-tertiary">${gig.bids.length} bid${gig.bids.length !== 1 ? "s" : ""}</span>` : ""}
                        </div>
            </div>
        `,
      )
      .join("")
  }

  renderPostedGigs() {
    const myGigs = this.gigs.filter((g) => g.userId === this.currentUser.id)

    if (myGigs.length === 0) {
      return `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No posted gigs yet</h3>
                    <p>Post your first gig to get started!</p>
                    <button class="btn btn-primary" onclick="app.openPostGigModal()">Post a Gig</button>
                </div>
            `
    }

    return `
            <div class="grid grid-cols-2">
                ${myGigs
                  .map(
                    (gig) => `
                    <div class="card">
                        <h3>${gig.title}</h3>
                        <p>${gig.description}</p>
                        <div style="margin: 16px 0; padding: 16px; background-color: var(--bg-tertiary); border-radius: var(--radius);">
                            <div class="price">$${gig.pay}</div>
                            <div style="margin-top: 8px;">
                                <span class="tag" style="background-color: ${gig.status === 'completed' ? '#10b981' : '#3b82f6'}">
                                    ${gig.status === 'completed' ? '✅ Completed' : '🟡 Open'}
                                </span>
                            </div>
                        </div>
                        ${gig.status === 'open' ? `
                        <div class="gig-actions" style="margin-bottom: 16px;">
                            <button class="btn btn-secondary btn-sm" onclick="app.openEditGigModal(${gig.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="app.deleteGigHandler(${gig.id})">Delete</button>
                        </div>
                        ` : ''}
                        ${
                          gig.bids.length > 0
                            ? `
                            <div class="bids-section">
                                <h4 style="margin-bottom: 12px;">Bids (${gig.bids.length})</h4>
                                ${gig.bids
                                  .map(
                                    (bid) => `
                                    <div class="bid-card">
                                        <div class="bid-info">
                                            <div class="bid-amount">$${bid.amount}</div>
                                            <div class="bid-meta">by ${bid.author} • ${bid.time}</div>
                                        </div>
                                        <button class="btn btn-primary btn-sm" onclick="app.acceptBid(${gig.id}, ${bid.id})">${gig.userId === this.currentUser.id ? 'Accept' : 'View'}</button>
                                    </div>
                                `,
                                  )
                                  .join("")}
                            </div>
                        `
                            : '<p style="color: var(--text-tertiary); margin-top: 16px;">No bids yet</p>'
                        }
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `
  }

  renderProfile() {
    return `
            <div>
                <div class="profile-header">
                    <div class="avatar">${this.currentUser.name[0].toUpperCase()}</div>
                    <div>
                        <h1>${this.currentUser.name}</h1>
                        <p>${this.currentUser.email}</p>
                        <p style="margin-top: 12px; color: var(--text-secondary);">${this.currentUser.bio}</p>
                        <div class="profile-stats">
                            <div class="stat">
                                <div class="stat-value">${this.currentUser.completedTasks}</div>
                                <div class="stat-label">Completed</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">$${this.currentUser.earnings}</div>
                                <div class="stat-label">Earnings</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">${this.currentUser.rating}</div>
                                <div class="stat-label">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 style="margin: 32px 0 16px 0;">Portfolio</h2>
                ${
                  (() => {
                    const userPortfolio = this.portfolio.filter(item => item.userId === this.currentUser.id)
                    return userPortfolio.length === 0
                    ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">🎯</div>
                        <h3>Portfolio is empty</h3>
                        <p>Complete gigs to build your portfolio!</p>
                    </div>
                `
                    : `
                    <div class="grid grid-cols-2">
                        ${userPortfolio
                          .map(
                            (item) => `
                            <div class="portfolio-item">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <div style="margin-top: 12px; padding: 12px; background-color: var(--bg-tertiary); border-radius: var(--radius);">
                                    <div class="price">$${item.amount}</div>
                                    <p class="text-sm text-secondary">Completed ${item.completedDate}</p>
                                    <div class="rating">
                                        ${Array(Math.floor(item.rating)).fill("⭐").join("")}
                                    </div>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                  })()
                }
            </div>
        `
  }

  // Modal Methods
  openGigDetails(gigId) {
    const gig = this.gigs.find((g) => g.id === gigId)
    if (!gig) return

    const modalContent = document.getElementById("modal-content")
    modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${gig.title}</h2>
                <button class="modal-close" onclick="app.closeModal()">×</button>
            </div>

            <div>
                <p>${gig.description}</p>
                
                <div style="margin: 24px 0; padding: 20px; background-color: var(--bg-tertiary); border-radius: var(--radius);">
                    <div class="price">$${gig.pay}</div>
                    <div class="gig-meta" style="margin-top: 12px;">
                        <span class="tag">⏱️ ${gig.time}</span>
                        <span class="tag">${gig.location === "remote" ? "💻" : "📍"} ${gig.location}</span>
                        <span class="tag">📅 ${gig.deadline}</span>
                    </div>
                </div>

                <button class="btn btn-primary btn-full" onclick="app.openBidForm(${gig.id})" style="margin: 24px 0;">Submit a Bid</button>

                ${gig.userId === this.currentUser.id ? `
                <div class="gig-owner-actions" style="margin: 24px 0; padding: 16px; background-color: var(--bg-tertiary); border-radius: var(--radius);">
                    <h4 style="margin-bottom: 12px;">Manage Your Gig</h4>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary" onclick="app.openEditGigModal(${gig.id})">Edit Gig</button>
                        <button class="btn btn-danger" onclick="app.deleteGigHandler(${gig.id})">Delete Gig</button>
                    </div>
                </div>
                ` : ''}

                ${
                  gig.bids.length > 0
                    ? `
                    <div class="bids-section">
                        <h3>Bids (${gig.bids.length})</h3>
                        ${gig.bids
                          .map(
                            (bid) => `
                            <div class="bid-card">
                                <div class="bid-info">
                                    <div class="bid-amount">$${bid.amount}</div>
                                    <div class="bid-meta">by ${bid.author}</div>
                                    <p class="text-sm" style="margin-top: 4px;">Delivery: ${bid.time}</p>
                                </div>
                                <button class="btn btn-primary btn-sm" onclick="app.acceptBid(${gig.id}, ${bid.id})">${gig.userId === this.currentUser.id ? 'Accept' : 'View'}</button>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `

    document.getElementById("modal-overlay").classList.add("active")
  }

  openBidForm(gigId) {
    const gig = this.gigs.find((g) => g.id === gigId)
    if (!gig) return

    const modalContent = document.getElementById("modal-content")
    modalContent.innerHTML = `
            <div class="modal-header">
                <h2>Submit Bid</h2>
                <button class="modal-close" onclick="app.closeModal()">×</button>
            </div>

            <div>
                <p style="margin-bottom: 24px; color: var(--text-secondary);">For: <strong style="color: var(--text-primary);">${gig.title}</strong></p>
                
                <div class="form-group">
                    <label>Your Bid Amount ($)</label>
                    <input type="number" id="bid-amount" placeholder="${gig.pay}" min="0" step="0.01">
                </div>

                <div class="form-group">
                    <label>Delivery Time</label>
                    <select id="delivery-time">
                        <option value="">Select delivery time</option>
                        <option value="30 mins">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="4 hours">4 hours</option>
                        <option value="1 day">1 day</option>
                        <option value="2 days">2 days</option>
                    </select>
                </div>

                <button class="btn btn-primary btn-full" onclick="app.submitBidHandler(${gigId})">Submit Bid</button>
            </div>
        `

    document.getElementById("modal-overlay").classList.add("active")
  }

  openPostGigModal() {
    const modalContent = document.getElementById("modal-content")
    modalContent.innerHTML = `
            <div class="modal-header">
                <h2>Post a New Gig</h2>
                <button class="modal-close" onclick="app.closeModal()">×</button>
            </div>

            <div>
                <div class="form-group">
                    <label>Gig Title</label>
                    <input type="text" id="gig-title" placeholder="e.g., Design logo for my startup">
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea id="gig-description" placeholder="Describe what you need..."></textarea>
                </div>

                <div class="form-group">
                    <label>Skill Category</label>
                    <select id="gig-skill">
                        <option value="design">Design</option>
                        <option value="writing">Writing</option>
                        <option value="tutoring">Tutoring</option>
                        <option value="tech">Tech</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Budget ($)</label>
                    <input type="number" id="gig-pay" placeholder="50" min="0" step="0.01">
                </div>

                <div class="form-group">
                    <label>Time Estimate</label>
                    <input type="text" id="gig-time" placeholder="e.g., 2 hours">
                </div>

                <div class="form-group">
                    <label>Location</label>
                    <select id="gig-location">
                        <option value="remote">Remote</option>
                        <option value="campus">On Campus</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Deadline</label>
                    <input type="text" id="gig-deadline" placeholder="e.g., 2 days">
                </div>

                <button class="btn btn-primary btn-full" onclick="app.postGigHandler()">Post Gig</button>
            </div>
        `

    document.getElementById("modal-overlay").classList.add("active")
  }

  openEditGigModal(gigId) {
    const gig = this.gigs.find((g) => g.id === gigId)
    if (!gig || gig.userId !== this.currentUser.id) return

    const modalContent = document.getElementById("modal-content")
    modalContent.innerHTML = `
            <div class="modal-header">
                <h2>Edit Gig</h2>
                <button class="modal-close" onclick="app.closeModal()">×</button>
            </div>

            <div>
                <div class="form-group">
                    <label>Gig Title</label>
                    <input type="text" id="edit-gig-title" value="${gig.title}" placeholder="e.g., Design logo for my startup">
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea id="edit-gig-description" placeholder="Describe what you need...">${gig.description}</textarea>
                </div>

                <div class="form-group">
                    <label>Skill Category</label>
                    <select id="edit-gig-skill">
                        <option value="design" ${gig.skill === 'design' ? 'selected' : ''}>Design</option>
                        <option value="writing" ${gig.skill === 'writing' ? 'selected' : ''}>Writing</option>
                        <option value="tutoring" ${gig.skill === 'tutoring' ? 'selected' : ''}>Tutoring</option>
                        <option value="tech" ${gig.skill === 'tech' ? 'selected' : ''}>Tech</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Budget ($)</label>
                    <input type="number" id="edit-gig-pay" value="${gig.pay}" placeholder="50" min="0" step="0.01">
                </div>

                <div class="form-group">
                    <label>Time Estimate</label>
                    <input type="text" id="edit-gig-time" value="${gig.time}" placeholder="e.g., 2 hours">
                </div>

                <div class="form-group">
                    <label>Location</label>
                    <select id="edit-gig-location">
                        <option value="remote" ${gig.location === 'remote' ? 'selected' : ''}>Remote</option>
                        <option value="campus" ${gig.location === 'campus' ? 'selected' : ''}>On Campus</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Deadline</label>
                    <input type="text" id="edit-gig-deadline" value="${gig.deadline}" placeholder="e.g., 2 days">
                </div>

                <button class="btn btn-primary btn-full" onclick="app.editGigHandler(${gig.id})">Update Gig</button>
            </div>
        `

    document.getElementById("modal-overlay").classList.add("active")
  }

  deleteGigHandler(gigId) {
    if (confirm('Are you sure you want to delete this gig?')) {
      if (this.deleteGig(gigId)) {
        alert('Gig deleted successfully!')
      } else {
        alert('You can only delete your own gigs!')
      }
    }
  }

  editGigHandler(gigId) {
    const title = document.getElementById("edit-gig-title").value
    const description = document.getElementById("edit-gig-description").value
    const skill = document.getElementById("edit-gig-skill").value
    const pay = Number.parseFloat(document.getElementById("edit-gig-pay").value)
    const time = document.getElementById("edit-gig-time").value
    const location = document.getElementById("edit-gig-location").value
    const deadline = document.getElementById("edit-gig-deadline").value

    if (title && description && skill && pay && time && location && deadline) {
      if (this.editGig(gigId, { title, description, skill, pay, time, location, deadline })) {
        this.closeModal()
        alert('Gig updated successfully!')
      } else {
        alert('You can only edit your own gigs!')
      }
    } else {
      alert("Please fill in all fields")
    }
  }

  closeModal() {
    document.getElementById("modal-overlay").classList.remove("active")
  }

  // Handlers
  handleLogin() {
    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    if (email && password) {
      this.login(email, password)
    } else {
      alert("Please fill in all fields")
    }
  }

  handleSignup() {
    const name = document.getElementById("signup-name").value
    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value

    if (name && email && password) {
      this.signup(email, password, name)
    } else {
      alert("Please fill in all fields")
    }
  }

  toggleAuthForm() {
    document.getElementById("login-form").style.display =
      document.getElementById("login-form").style.display === "none" ? "block" : "none"
    document.getElementById("signup-form").style.display =
      document.getElementById("signup-form").style.display === "none" ? "block" : "none"
  }

  postGigHandler() {
    const title = document.getElementById("gig-title").value
    const description = document.getElementById("gig-description").value
    const skill = document.getElementById("gig-skill").value
    const pay = Number.parseFloat(document.getElementById("gig-pay").value)
    const time = document.getElementById("gig-time").value
    const location = document.getElementById("gig-location").value
    const deadline = document.getElementById("gig-deadline").value

    if (title && description && skill && pay && time && location && deadline) {
      this.createGig({ title, description, skill, pay, time, location, deadline })
      this.closeModal()
      this.render()
    } else {
      alert("Please fill in all fields")
    }
  }

  submitBidHandler(gigId) {
    const amount = Number.parseFloat(document.getElementById("bid-amount").value)
    const time = document.getElementById("delivery-time").value

    if (amount && time) {
      this.submitBid(gigId, amount, time)
      this.closeModal()
      this.render()
    } else {
      alert("Please fill in all fields")
    }
  }

  switchSection(section) {
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"))
    document.getElementById(section).classList.add("active")

    document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"))
    event.target.classList.add("active")
  }

  updateFilters() {
    const container = document.getElementById("gigs-container")
    if (container) {
      container.innerHTML = this.renderGigsList()
    }
  }

  getActiveSection() {
    const section = document.querySelector(".section.active")
    return section ? section.id : "feed"
  }

  attachEventListeners() {
    // Handle modal close on overlay click
    const overlay = document.getElementById("modal-overlay")
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.closeModal()
        }
      })
    }
  }
}

// Initialize app
const app = new GigHubApp()
