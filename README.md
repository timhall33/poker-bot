# **Development of a Texas Hold'em Poker Bot Using a Simplified Counterfactual Regret Minimization Algorithm**

Timothy Hall  
Franklin College of Arts and Sciences  
University of Georgia  
Athens, Ga  

**ABSTRACT**

In this paper, I present the development of a Texas Hold'em poker bot using a simplified variant of the Counterfactual Regret Minimization (CFR) algorithm, inspired by Libratus, a world-class poker bot. Our implementation addresses the computational challenges by reducing the game tree, employing betting restrictions, and clustering similar hands together for strategy sharing. The bot is trained on a 2-core Mac computer for 100,000 iterations which took a little over 1 hour, significantly less than Libratus' 15 million core hours. The resulting poker bot is deployed on a user interface created with React, allowing users to interactively play against the bot.

1 **Introduction**

Texas Hold'em poker is a complex, non-cooperative game that requires strategic decision-making under imperfect information. In recent years, artificial intelligence has shown significant success in mastering this game, with bots like Libratus defeating top human players. Our goal is to create a simplified version of a poker bot using the CFR algorithm while addressing the computational limitations and complexity of the game tree.

2 **Background and Related Work**

2.1. Libratus and CFR Algorithm

Libratus is a poker bot designed at Carnegie Mellon University that defeated top poker players in 2017. It was trained for 15 million core hours using the CFR algorithm, which aims to minimize regret and approach the Nash Equilibrium in non-cooperative games such as Texas Hold'em poker.

2.2. Nash Equilibrium

The Nash Equilibrium is a game theory concept that determines the optimal solution in a non-cooperative game where players lack the incentive to change their initial strategy. In poker, the algorithm simulates the potential outcomes for various actions, helping players identify the best course of action.

2.3. Counterfactual Regret Minimization

The CFR algorithm aims to minimize regret by considering counterfactual outcomes that could have happened under different conditions. Counterfactual means something that has not happened but could under different conditions. Regret is something you wish had done but did not do. By minimizing regret, the algorithm converges towards the Nash Equilibrium, leading to optimal strategies for decision-making in poker.

2.4. Related Work

Several studies have explored the development of poker bots using various techniques. Lisy and Bowling [1] investigated the equilibrium approximation quality of current no-limit poker bots. Yuan et al. [2] developed EnsembleCard, a strategy ensemble bot for two-player no-limit Texas Hold'em poker. Watson et al. [3] focused on improving a case-based Texas Hold'em poker bot.

3 **Methodology**

3.1. Game Tree Reduction

I modified the game tree by limiting it to two players and providing only five predefined betting options: Fold, Check/Call, Raise 2/3 of the pot, Raise 2 times the pot, or go All-in. Additionally, I removed the ability to re-raise an existing bet, which significantly reduced the computation time for each iteration.

3.2. Hand Clustering

In poker, there are 2.5 million different hand combinations (combinations of 5 cards from a 52-card deck). Nodes could not be based on their unique hand combinations, so I ranked each hand on a scale of 0 to 9 at every point in the game tree to cluster similar hands together. This ranking, along with the last action taken by the opponent, the current betting round, and the pot size (small, medium, or large), was used to create the nodes in the game tree.

3.3. Algorithm Implementation

The CFR algorithm recursively traverses the game tree, calculating regrets at terminal nodes. After each iteration, the strategy is updated based on accumulated regrets. The algorithm also tracks the probability of reaching each node to factor this information into optimal strategy calculations.

3.4. Diagram

1 Iteration: No re-raises (0.6 seconds)

<img width="241" alt="image" src="https://github.com/timhall33/poker-bot/assets/113381294/8b523405-9ab9-4b34-bd95-bed8136a2579">

1 Iteration: Unlimited re-raises (14 minutes)

<img width="243" alt="image" src="https://github.com/timhall33/poker-bot/assets/113381294/c8188e56-6963-4c77-a94f-48e382515732">

4 **Implementation and Deployment**

4.1. Training the Bot

The poker bot was trained for a little over an hour, completing 100,000 iterations on a 2-core Mac computer. This is significantly less than the computation resources used by Libratus, but it still yields a viable poker bot for demonstration purposes.

4.2. User Interface

The poker bot is deployed on a user interface created with React, allowing users to interactively play against the bot. The interface considers each player's current bet, the pot size, and the total amount of money won. An explanation of the implementation can be found in the README.md file in the project repository. A playthrough demonstrating the poker bot in action can be found at [4].

5 **Conclusion**

I have presented a simplified poker bot that employs a variant of the CFR algorithm used in Libratus. By reducing the game tree and clustering similar hands together, I addressed the computational challenges inherent in Texas Hold'em poker. Our implementation demonstrates the potential for developing competitive poker bots with limited computational resources.

**REFERENCES**

[1] V. Lisy and M. Bowling, "Equilibrium Approximation Quality of Current No-Limit Poker Bots," in Artificial Intelligence, vol. 222.

[2] W. Yuan, T. Wei, J. Luo, L. Lu, W. Zhang, and J. Chen, "EnsembleCard: A Strategy Ensemble Bot For Two-Player No-Limit Texas Hold'em Poker," in Proceedings of the 2020 IEEE Conference on Games (CoG).

[3] I. Watson, S. Lee, J. Rubin, and S. Wender, "Improving a case-based texas hold'em poker bot," in Proceedings of the 18th International Conference on Case-Based Reasoning Research and Development (ICCBR 2010).

[4] T. Hall, "Texas Hold'em Poker Bot Playthrough," YouTube, [https://youtu.be/7SdSJueB99I], 2023.
