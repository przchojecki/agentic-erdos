# Agentic Erdős

Tracking repository for experimental progress on Erdős problems from the `ulamai/UnsolvedMath` dataset subset we downloaded locally.

## Scope

- Total problems tracked: **632**
- Triaged as `to-check`: **375**
- Triaged as `harder` (post-2000 reference signal): **257**
- Records with deep-attempt workflow initialized: **382**
- Records with at least one explicit attempt/progress status: **382**
- README last generated (UTC): **2026-03-03T12:01:09.402Z**

## Progress Status Counts

- `deprioritized_post2000_refs`: 250
- `no_background_partial_result`: 20
- `statement_issue_malformed_dataset_entry`: 16
- `partially_resolved_not_fully_closed`: 3
- `order_known_constant_open`: 3
- `counterexample_proved_as_written`: 2
- `adversarial_search_frontier_extended_not_proved`: 2
- `resolved_in_background_as_written`: 2
- `two_sided_bounds_known_asymptotic_open`: 2
- `stronger_than_classical_bounds_known_constant_factor_question_open`: 1
- `low_k_progress_general_case_open`: 1
- `large_structural_progress_full_limit_set_open`: 1
- `infinitude_known_positive_density_open`: 1
- `strong_finite_coverage_signal_universal_k_open`: 1
- `density_zero_known_finer_asymptotics_open`: 1

## Data and Notes

- Main merged progress source: `data/erdos_to_check_ranked_with_deep_attempts_top20.jsonl` + `data/erdos_harder.jsonl`
- CSV export of table below: `data/all_problems_progress.csv`
- Attempt notes directory: `notes/`
- Formal proved-results writeup: `notes/proved_results.md`
- Analysis / search scripts directory: `scripts/`

## Math Formatting

- Inline math uses `$...$`, for example $h(N)=N^{1/2}+O_\varepsilon(N^\varepsilon)$.
- Display math uses `$$...$$`.

## Regenerate This README

```bash
node scripts/generate_readme_progress.mjs
```

## Full Problem Table

<details>
<summary>Show all 632 problems</summary>

| Problem | Title | Bucket | Rank | Latest Ref | Progress | Note |
|---|---|---:|---:|---:|---|---|
| EP-1 | Erdős Problem #1 | harder |  | 2023 | stronger_than_classical_bounds_known_constant_factor_question_open | recorded exact bound N>=binom(n,floor(n/2)) and relation to original N>>2^n target |
| EP-3 | Erdős Problem #3 | harder |  | 2024 | low_k_progress_general_case_open | documented that current technology handles short progression lengths far better than arbitrary length |
| EP-5 | Erdős Problem #5 | harder |  | 2020 | large_structural_progress_full_limit_set_open | recorded known inclusion results and endpoint membership for limit-point set S |
| EP-9 | Erdős Problem #9 | harder |  | 2011 | infinitude_known_positive_density_open | recorded known N^{1-eps}-type lower bounds for exceptional-count growth |
| EP-10 | Erdős Problem #10 | to-check | 362 | 1998 | strong_finite_coverage_signal_universal_k_open | up to 250000, all n>=2 were representable for k=3 (and k=4); k=2 left sparse exceptions |
| EP-12 | Erdős Problem #12 | harder |  | 2017 | density_zero_known_finer_asymptotics_open | recorded near-N^{1/2} constructive lower side and unresolved reciprocal-sum finiteness question |
| EP-14 | Erdős Problem #14 | to-check | 310 | 1991 | heuristic_sqrt_scale_exception_profile_observed_asymptotic_open | Quick searches for N up to 360 found bad counts 68, 97, 146, 215, consistent with square-root-scale growth. |
| EP-15 | Erdős Problem #15 | harder |  | 2023 | finite_numeric_behavior_convergent_like_unconditional_proof_open | partial sums stayed small and stable in range [-0.5,0.1667], ending near -0.0213 at n=2e6 |
| EP-17 | Erdős Problem #17 | harder |  | 2004 | strong_finite_abundance_signal_infinitude_open | found 3618 cluster primes up to 300000, largest 299393 |
| EP-18 | Erdős Problem #18 | to-check | 285 | 1985 | finite_practical_and_factorial_h_values_small_asymptotics_open | For practical m<=12000 sampled values of h(m) are single digits; additionally h(3!)..h(8!) = 2,3,4,5,5,6. |
| EP-20 | Erdős Problem #20 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-25 | Erdős Problem #25 | to-check | 1 |  | partial_positive_result_not_full_proof | proved logarithmic density exists when sum_i 1/n_i converges; also proved existence for pairwise-coprime moduli (density given by product, including zero in divergent case) |
| EP-28 | Erdős Problem #28 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-30 | Erdős Problem #30 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-32 | Erdős Problem #32 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-33 | Erdős Problem #33 | harder |  | 2001 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-36 | Erdős Problem #36 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-38 | Erdős Problem #38 | to-check | 147 | 1942 | basis_case_known_nonbasis_strengthening_open | Erdos proved a quantitative increment when B is an additive basis of order k; Linnik constructed essential components not additive bases. |
| EP-39 | Erdős Problem #39 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-40 | Erdős Problem #40 | to-check | 2 |  | log_case_reduced_not_solved | reduced g(N)=log N case to dense bounded-representation growth statement: for each fixed K, must have A(N)=o(sqrt(N)/log N) if implication is true |
| EP-41 | Erdős Problem #41 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-42 | Erdős Problem #42 | to-check | 3 |  | exact_M3_nonmonotone_finite_behavior_mixed | Exact M=3 search finds counterexamples at N=74..77 and N=86..98, but no counterexample at N=78..85 (all Sidon A admit a disjoint Sidon triple). |
| EP-43 | Erdős Problem #43 | to-check | 4 |  | attempted_not_proved_runtime_profiled | cannot bridge from two-color disjoint-difference constraints to single Sidon extremal scale C(f(N),2)+O(1) |
| EP-44 | Erdős Problem #44 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-50 | Erdős Problem #50 | to-check | 338 | 1995 | singularity_known_derivative_positive_point_question_open | computed empirical CDF slopes for n<=300000; observed irregular spike profile compatible with singular behavior |
| EP-51 | Erdős Problem #51 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-52 | Erdős Problem #52 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-60 | Erdős Problem #60 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-61 | Erdős Problem #61 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-62 | Erdős Problem #62 | to-check | 292 | 1987 | known_common_odd_cycles_stronger_common_chromatic_subgraph_open | Background ensures sufficiently large odd cycles appear in every aleph_1-chromatic graph, but this does not resolve the asked common chi=4/aleph_0 subgraph statement. |
| EP-65 | Erdős Problem #65 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-66 | Erdős Problem #66 | harder |  | 2007 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-68 | Erdős Problem #68 | to-check | 295 | 1988 | finite_denominator_exclusion_extended_no_full_irrationality_proof | Using exact partial sum S_22 and rigorous tail bound S-S_22 < 6/23!, no rational p/q with q<=5,000,000 lies in the admissible interval; hence the constant cannot have denominator <=5e6. |
| EP-70 | Erdős Problem #70 | to-check | 5 |  | no_progress_transfinite_stepup_gap | No new partition-relation transfer from c->(omega+n,4)^3_2 to c->(beta,n)^3_2 for arbitrary countable beta was obtained in this batch. |
| EP-74 | Erdős Problem #74 | to-check | 269 | 1982 | linear_f_case_constructed_sublinear_open | Background gives Rodl's construction for graphs with chromatic number aleph_0 when f(n)=epsilon*n (any fixed epsilon>0). |
| EP-75 | Erdős Problem #75 | to-check | 342 | 1995 | attempted_not_proved_set_theoretic_construction_open | isolated the competing global-coloring and local-independence requirements but found no bridge |
| EP-77 | Erdős Problem #77 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-78 | Erdős Problem #78 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-80 | Erdős Problem #80 | harder |  | 2012 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-81 | Erdős Problem #81 | to-check | 335 | 1994 | coefficient_gap_between_known_upper_and_target_open | recorded gap between known upper bound below n^2/4 and target n^2/6+O(n) |
| EP-82 | Erdős Problem #82 | harder |  | 2007 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-84 | Erdős Problem #84 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-86 | Erdős Problem #86 | harder |  | 2014 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-87 | Erdős Problem #87 | to-check | 325 | 1993 | partially_resolved_original_form_false_weaker_forms_open | recorded that original conjecture fails at k=4 (wheel example) while weaker relative-to-R(k) inequalities remain open |
| EP-89 | Erdős Problem #89 | harder |  | 2015 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-90 | Erdős Problem #90 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-91 | Erdős Problem #91 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-92 | Erdős Problem #92 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-96 | Erdős Problem #96 | harder |  | 2015 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-98 | Erdős Problem #98 | to-check | 326 | 1993 | attempted_not_proved_superlinear_lower_bound_open | documented known near-linear upper construction scale from background and inability to force h(n)/n -> infinity |
| EP-99 | Erdős Problem #99 | to-check | 363 | 1999 | explicit_small_n_counterexample_written_asymptotic_open | Explicit n=4 witness (unit square vertices) has min distance 1 and no unit equilateral triangle, confirming literal statement failure at small n. |
| EP-100 | Erdős Problem #100 | harder |  | 2015 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-101 | Erdős Problem #101 | harder |  | 2013 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-102 | Erdős Problem #102 | to-check | 339 | 1995 | attempted_not_proved_even_weak_growth_open | isolated that known constructions permit comparatively small maximum line multiplicity despite many rich lines |
| EP-103 | Erdős Problem #103 | to-check | 6 |  | extremal_geometry_structure_gap_no_progress | No new lower-bound mechanism for h(n) was found; even eventual h(n)>=2 remains unresolved in the supplied background. |
| EP-104 | Erdős Problem #104 | to-check | 324 | 1992 | explicit_linear_construction_verified_quadratic_gap_open | triangular-lattice hex patches give n lattice-centered unit circles with at least 3 selected points for tested n up to 2437 |
| EP-108 | Erdős Problem #108 | to-check | 247 | 1979 | r4_case_solved_general_higher_girth_open | Rödl solved the r=4 case (per background); no full resolution for general r>=5 is provided here. |
| EP-111 | Erdős Problem #111 | to-check | 273 | 1982 | n_to_n3over2_bounds_known_growth_open | Background gives h_G(n)>>n for every chi(G)=aleph_1 graph, and existence of one with h_G(n)<<n^{3/2}. |
| EP-112 | Erdős Problem #112 | to-check | 354 | 1997 | broad_bounds_known_exact_asymptotics_open | recorded known polynomial upper bounds for fixed m and Ramsey-type sandwich inequalities |
| EP-114 | Erdős Problem #114 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-117 | Erdős Problem #117 | to-check | 357 | 1997 | exponential_bounds_known_exact_rate_open | Background gives c1^n<h(n)<c2^n for constants c2>c1>1 (Pyber/earlier lower-bound work). |
| EP-119 | Erdős Problem #119 | to-check | 315 | 1991 | partially_resolved_not_fully_closed | recorded that limsup M_n=infinity and polynomial spike max_{n<=N}M_n>N^c are known; unresolved part is sum_{k<=n}M_k>n^{1+c} for all large n |
| EP-120 | Erdős Problem #120 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-122 | Erdős Problem #122 | to-check | 350 | 1997 | function_specific_cases_known_general_classification_open | recorded solved positive instances (divisor-type functions) versus expected failure for phi/sigma |
| EP-123 | Erdős Problem #123 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-124 | Erdős Problem #124 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-125 | Erdős Problem #125 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-126 | Erdős Problem #126 | to-check | 142 | 1934 | classical_bounds_known_divergence_open | Background gives log n << f(n) << n/log n. |
| EP-129 | Erdős Problem #129 | to-check | 7 |  | counterexample_proved_as_written | For every fixed r>=2, random r-colorings plus Steiner-triple-system decomposition for n≡1,3 (mod 6) give R(n;3,r) >= exp(c_r n) on infinitely many n, contradicting any C(r)^{sqrt(n)} upper bound. |
| EP-130 | Erdős Problem #130 | to-check | 355 | 1997 | infinite_clique_ruled_out_infinite_chromaticity_open | recorded that one subquestion is settled negatively (no infinite complete graph), leaving chromatic-number growth as core open part |
| EP-131 | Erdős Problem #131 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-132 | Erdős Problem #132 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-137 | Erdős Problem #137 | to-check | 274 | 1982 | no_witness_in_large_scan_global_nonexistence_open | No powerful product found for 3<=k<=12 and m<=300000 in exact factor-exponent scans. |
| EP-138 | Erdős Problem #138 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-141 | Erdős Problem #141 | harder |  | 2008 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-142 | Erdős Problem #142 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-143 | Erdős Problem #143 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-145 | Erdős Problem #145 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-146 | Erdős Problem #146 | harder |  | 2003 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-148 | Erdős Problem #148 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-149 | Erdős Problem #149 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-151 | Erdős Problem #151 | to-check | 320 | 1992 | attempted_not_proved_statement_may_be_delicate | reduced task to a missing transfer principle from triangle-free independence thresholds to arbitrary-graph clique-transversal bounds |
| EP-152 | Erdős Problem #152 | to-check | 8 |  | adversarial_search_frontier_extended_not_proved | Extended fixed-m adversarial search up to m=80: best-known isolated counts remain large (18 at m=11, 82 at m=20, 228 at m=30, 455 at m=40, 764 at m=50, 1156 at m=60, 1640 at m=70, 2206 at m=80). |
| EP-153 | Erdős Problem #153 | to-check | 9 |  | adversarial_search_frontier_extended_not_proved | Extended fixed-m adversarial search up to m=80: best-known average squared gaps keep increasing (11.27 at m=11, 28.08 at m=20, 66.16 at m=30, 121.56 at m=40, 154.65 at m=50, 218.26 at m=60, 301.62 at m=70, 373.09 at m=80). |
| EP-155 | Erdős Problem #155 | to-check | 10 |  | exact_FN_increment_profile_to_72_supports_small_k_no_counterexample | Exact profile to N<=72 gives F(N+1)-F(N) in {0,1} throughout tested range (also max increment 1 for k=2,3 in range). |
| EP-156 | Erdős Problem #156 | to-check | 360 | 1998 | finite_heuristic_support_for_n_cuberoot_scale_open | for N=200..3200, minimum found maximal Sidon sizes were 11,15,20,27,36 with stable ratios to N^(1/3) |
| EP-158 | Erdős Problem #158 | to-check | 11 |  | finite_B2_2_sqrtN_scale_constructions_found_liminf_open | Random-order greedy B2[2] constructions up to N=5000 achieve best \|A\|/sqrt(N) around 1.23..1.70, showing robust finite sqrt(N)-scale examples. |
| EP-159 | Erdős Problem #159 | to-check | 238 | 1978 | log_saving_known_power_saving_open | Background bounds remain n^(3/2)/(log n)^(3/2) << R(C4,Kn) << n^2/(log n)^2. |
| EP-160 | Erdős Problem #160 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-161 | Erdős Problem #161 | harder |  | 2011 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-162 | Erdős Problem #162 | to-check | 12 |  | log_scale_known_constant_identification_open_no_new_bound | Reconfirmed logarithmic-order window from background; no new estimate for the asymptotic constant c_alpha was proved. |
| EP-165 | Erdős Problem #165 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-168 | Erdős Problem #168 | to-check | 229 | 1977 | exact_finite_frontier_extended_with_certified_values | Machine-verified exact values computed for F(N) on sampled N from 20 to 75 in steps of 5; ratios are mostly 0.8 with one sampled value 0.82. |
| EP-169 | Erdős Problem #169 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-170 | Erdős Problem #170 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-172 | Erdős Problem #172 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-173 | Erdős Problem #173 | to-check | 224 | 1976 | right_triangle_case_solved_general_open | Background reports Shader proved the claim for a single right triangle. |
| EP-174 | Erdős Problem #174 | harder |  | 2012 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-176 | Erdős Problem #176 | to-check | 200 | 1973 | exact_small_parameter_thresholds_established_general_growth_open | Exact values found: N(3,2)=9, N(4,2)=13, N(5,2)=22, N(6,2)=11, N(6,3)=42. |
| EP-177 | Erdős Problem #177 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-180 | Erdős Problem #180 | to-check | 13 |  | counterexample_proved_as_written | Explicit finite family counterexample: F={K_{1,2},2K_2}. Then ex(n;F)=1 for n>=2, while ex(n;K_{1,2})=floor(n/2)=Theta(n) and ex(n;2K_2)=n-1=Theta(n), so no G in F satisfies ex(n;G)<<_F ex(n;F). |
| EP-181 | Erdős Problem #181 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-183 | Erdős Problem #183 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-184 | Erdős Problem #184 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-187 | Erdős Problem #187 | to-check | 251 | 1980 | finite_coloring_profiles_logscale_consistent_exact_order_open | On N=7000, d<=180, best random profiles stayed on low logarithmic scale relative to d. |
| EP-188 | Erdős Problem #188 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-190 | Erdős Problem #190 | to-check | 14 |  | k3_case_solved_exact_H3_equals_9_general_k_open | Exact canonical backtracking confirms for k=3: avoider colorings exist up to N=8 and fail at N=9, hence H(3)=9. |
| EP-193 | Erdős Problem #193 | to-check | 241 | 1979 | finite_construction_attempts_stall_no_general_proof | For target length 180, best achieved lengths were 17 (axis6), 8 (positive3), 41 (diag6), 58 (mixed8). |
| EP-195 | Erdős Problem #195 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-196 | Erdős Problem #196 | to-check | 230 | 1977 | finite_avoidance_witnesses_found_no_infinite_resolution | Full avoiding permutations were found for N=12 and N=14; no full witness found in this run for N=16,18,20,22. |
| EP-197 | Erdős Problem #197 | to-check | 15 |  | two_partition_permutation_approach_stalled_cross_block_obstruction | No two-class infinite construction or impossibility proof was obtained; cross-block monotone 3-AP interactions remained uncontrolled. |
| EP-200 | Erdős Problem #200 | to-check | 16 |  | exact_prime_AP_profile_to_1e6_sublog_open | Exact scans to N=10^6 give longest prime AP lengths 10,12,13 across sampled scales; no finite evidence settles o(log N). |
| EP-201 | Erdős Problem #201 | to-check | 217 | 1975 | interval_model_matches_R3_on_small_N_relation_open | For N=6..9 in the interval model, worst-case AP-free size equals exact R_3(N) (ratio 1). |
| EP-202 | Erdős Problem #202 | harder |  | 2013 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-203 | Erdős Problem #203 | to-check | 17 |  | finite_box_scan_no_candidate_up_to_m50000_exponents_8_6 | For all m<=50000 with gcd(m,6)=1, at least one value 2^k 3^l m + 1 is prime within 0<=k<=8, 0<=l<=6; no finite-box survivor found. |
| EP-208 | Erdős Problem #208 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-212 | Erdős Problem #212 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-213 | Erdős Problem #213 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-217 | Erdős Problem #217 | to-check | 279 | 1983 | finite_geometric_random_search_no_witness_no_impossibility | No configuration with multiplicity profile 1..n-1 was found for n=6,7,8,9 in current random grid experiments. |
| EP-218 | Erdős Problem #218 | to-check | 283 | 1985 | finite_density_estimates_near_half_equal_gaps_seen_asymptotic_open | Up to n=10^6, proportions of d_{n+1}>=d_n and d_{n+1}<=d_n are both about 0.516, with many equal-gap events observed. |
| EP-222 | Erdős Problem #222 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-233 | Erdős Problem #233 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-234 | Erdős Problem #234 | to-check | 18 |  | statement_issue_malformed_dataset_entry_blocked | Local dataset statement is malformed (contains injected JSON fragment), so a mathematically reliable proof attempt is blocked until the statement text is repaired. |
| EP-236 | Erdős Problem #236 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-238 | Erdős Problem #238 | to-check | 150 | 1949 | small_c1_case_solved_full_range_open | Background records Erdos proved the claim for any fixed c2>0 when c1 is sufficiently small. |
| EP-241 | Erdős Problem #241 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-243 | Erdős Problem #243 | harder |  | 2001 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-244 | Erdős Problem #244 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-247 | Erdős Problem #247 | to-check | 302 | 1988 | stronger_sparsity_regime_solved_weaker_limsup_ratio_open | Background gives transcendence under much stronger growth conditions; the stated weaker limsup(a_n/n)=infinity regime remains unresolved here. |
| EP-249 | Erdős Problem #249 | to-check | 19 |  | finite_denominator_exclusion_to_5e6_no_irrationality_proof | Using exact partial sum at N=140 and rigorous tail bound, no rational p/q with q<=5,000,000 lies in the admissible interval for sum_n phi(n)/2^n. |
| EP-251 | Erdős Problem #251 | to-check | 300 | 1988 | factorial_denominator_variant_solved_power_two_denominator_open | Known irrationality for prime-weighted factorial-denominator series does not resolve the 2^n-denominator case in this batch. |
| EP-252 | Erdős Problem #252 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-254 | Erdős Problem #254 | to-check | 161 | 1960 | stronger_hypotheses_case_known_weaker_open | Cassels proved the conclusion under stronger growth and square-fractional-sum divergence assumptions. |
| EP-256 | Erdős Problem #256 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-257 | Erdős Problem #257 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-258 | Erdős Problem #258 | to-check | 199 | 1971 | monotone_case_solved_general_open_extension_attempted | Monotone case remains resolved; unrestricted a_n->infinity case still open in this record. |
| EP-260 | Erdős Problem #260 | to-check | 263 | 1981 | two_stronger_conditions_solved_general_open | Background states irrationality is proved if gaps a_{n+1}-a_n->infinity, or if a_n>>n*sqrt(log n*log log n). |
| EP-261 | Erdős Problem #261 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-263 | Erdős Problem #263 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-264 | Erdős Problem #264 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-265 | Erdős Problem #265 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-267 | Erdős Problem #267 | to-check | 333 | 1993 | proved_for_c_ge_2_open_for_1_lt_c_lt_2 | recorded historical resolution for c>=2 and isolation of unresolved window 1<c<2 |
| EP-269 | Erdős Problem #269 | to-check | 296 | 1988 | infinite_P_case_easy_finite_P_case_open | Background records irrationality for infinite P and for a modified duplicate-removed finite-P variant, while the stated finite-P sum remains open here. |
| EP-271 | Erdős Problem #271 | harder |  | 2011 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-272 | Erdős Problem #272 | to-check | 367 | 1999 | asymptotic_resolved_exact_open | Background gives Szabo (1999): t(N)=N^2/2 + O(N^{5/3}(log N)^3), resolving the asymptotic leading term. |
| EP-273 | Erdős Problem #273 | to-check | 20 |  | bounded_distinct_pminus1_cover_search_no_full_cover_found | Randomized greedy search with distinct moduli p-1 up to 400 reached ~91.3% coverage on [1..200000], but found no full cover in tested regime. |
| EP-274 | Erdős Problem #274 | harder |  | 2019 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-276 | Erdős Problem #276 | harder |  | 2014 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-278 | Erdős Problem #278 | to-check | 286 | 1986 | structured_family_reduction_obtained_general_max_density_open | For A={3}U{3p:p in P}, maximizing covered density reduces exactly to minimizing prod_{p in P1}(1-1/p)+prod_{p in P2}(1-1/p) over partitions P=P1 sqcup P2. |
| EP-279 | Erdős Problem #279 | to-check | 21 |  | k3_finite_prefix_residue_cover_scan_high_but_incomplete_coverage | For k=3, randomized greedy residue choices over primes<=300 cover about 90.44% of [5000,300000] in best run; no near-complete finite-prefix cover found. |
| EP-281 | Erdős Problem #281 | to-check | 178 | 1966 | resolved_in_background_as_written | Finite-truncation conclusion follows from background argument combining density limit for multiples and Rogers' extremal residue-class principle. |
| EP-282 | Erdős Problem #282 | to-check | 168 | 1964 | finite_exhaustive_tests_support_termination_not_proof | Exhaustive tests: all 8150 cases (n<=199) and all 32764 cases (n<=401) terminated. |
| EP-283 | Erdős Problem #283 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-288 | Erdős Problem #288 | to-check | 22 |  | singleton_second_interval_exact_scan_few_small_solutions_only | Exact scan up to endpoint 220 in the \|I2\|=1 case found only three disjoint solutions: [1,3]+1/6, [2,3]+1/6, [3,6]+1/20. |
| EP-289 | Erdős Problem #289 | to-check | 252 | 1980 | exact_randomized_search_no_witness_in_tested_ranges | No exact decomposition of 1 was found for tested k ranges up to 10 (Nmax 90) and up to 8 (Nmax 140) under current search budgets. |
| EP-291 | Erdős Problem #291 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-293 | Erdős Problem #293 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-295 | Erdős Problem #295 | to-check | 197 | 1971 | rigorous_harmonic_lower_bound_curve_established | Computed k_harm-(e-1)N on N<=2e4; observed range about [-0.8591,0.1419]. |
| EP-301 | Erdős Problem #301 | to-check | 23 |  | bounds_window_rechecked_no_constant_improvement | Rechecked local forbidden-configuration amplification ideas; no improvement beyond the known interval 1/2 <= limsup f(N)/N <= 25/28 was obtained. |
| EP-302 | Erdős Problem #302 | to-check | 311 | 1991 | half_density_guess_false_bounds_known | Background records f(N)>=(5/8+o(1))N and f(N)<=(9/10+o(1))N, so the subquestion f(N)=(1/2+o(1))N is ruled out by these bounds. |
| EP-304 | Erdős Problem #304 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-306 | Erdős Problem #306 | harder |  | 2015 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-311 | Erdős Problem #311 | to-check | 253 | 1980 | exact_small_N_exponential_decay_signal_constant_open | Exact delta(N) for N=10..30 gives -log(delta(N))/N roughly between 0.54 and 0.65. |
| EP-312 | Erdős Problem #312 | to-check | 24 |  | no_new_quantitative_progress_toward_exponential_gap | No new bound improving the known polynomial-gap approximation near 1 was derived in this batch. |
| EP-313 | Erdős Problem #313 | to-check | 25 |  | primary_pseudoperfect_scan_extended_to_1e8_no_new_values | Exact squarefree scan to m<=10^8 still finds only m in {2,6,42,1806,47058}. |
| EP-317 | Erdős Problem #317 | to-check | 26 |  | exact_signed_harmonic_min_profile_to_n26 | Exact meet-in-the-middle profile for n<=26 shows equality \|sum\|=1/[1..n] at n=3,4, and strict inequality for every n=5..26 tested. |
| EP-318 | Erdős Problem #318 | to-check | 277 | 1982 | first_yes_second_false_third_open | Arithmetic-progression version is true (Sattler, per background). Positive-density version is false: if A has exactly one even element e, choosing f(e)=1 and f(odd)=-1 prevents any finite zero-sum reciprocal subset. |
| EP-319 | Erdős Problem #319 | harder |  | 2001 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-320 | Erdős Problem #320 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-321 | Erdős Problem #321 | to-check | 226 | 1976 | exact_small_N_frontier_supports_N_over_logN_scale_not_asymptotic | Exact values computed for 8<=N<=25; R(25)=18 and R(N)/(N/log N) lies roughly in [1.82,2.33] on this range. |
| EP-322 | Erdős Problem #322 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-323 | Erdős Problem #323 | to-check | 27 |  | finite_fkmx_profiles_added_selected_km_pairs | Exact counts up to x=10^6 for selected pairs (k,m) provide finite-scale profiles; e.g., f_{3,2}(x)/x^{2/3} ~0.45 and f_{4,2}(x)/x^{1/2} ~0.49 in tested range. |
| EP-324 | Erdős Problem #324 | to-check | 28 |  | finite_range_evidence_no_global_proof | Local computation found no collisions for a^5+b^5 with 0<=a<b<=1200 (720600 pairs). |
| EP-325 | Erdős Problem #325 | harder |  | 2019 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-326 | Erdős Problem #326 | to-check | 158 | 1957 | stronger_AeqB_false_current_open | Background: the original version with A=B was disproved by Cassels. |
| EP-327 | Erdős Problem #327 | to-check | 29 |  | first_condition_upper_bound_known_variants_open | Background implies sets of size >=(25/28+o(1))N must contain a!=b with a+b dividing ab. |
| EP-329 | Erdős Problem #329 | harder |  | 2001 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-330 | Erdős Problem #330 | to-check | 30 |  | finite_surrogate_positive_signal_no_asymptotic_resolution | Finite-window search (N=320, window [N,2N]) found A of density 0.153 with 99.688% sum coverage and zero nonessential elements in the window (min indispensability ratio 0.0031). |
| EP-332 | Erdős Problem #332 | to-check | 248 | 1979 | finite_proxy_scan_consistent_with_density_sufficiency_not_new_criterion | Finite scans on random dense sets, primes, squares, and powers of two show clear gap-behavior separation consistent with known density-based sufficiency. |
| EP-334 | Erdős Problem #334 | to-check | 303 | 1989 | improved_exponent_bounds_known_exact_growth_order_open | Finite scans up to n=12000 show small minimal smoothness maxima (23 at N=12000); background records upper exponent 4/(9sqrt(e))+epsilon. |
| EP-335 | Erdős Problem #335 | to-check | 31 |  | rotation_model_examples_known_full_characterization_open | Background gives explicit examples from irrational-rotation coding on R/Z where d(A+B)=d(A)+d(B). |
| EP-336 | Erdős Problem #336 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-338 | Erdős Problem #338 | harder |  | 2007 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-340 | Erdős Problem #340 | to-check | 254 | 1980 | large_range_generation_profile_obtained_asymptotic_bound_open | Generated 691 terms up to about 5.03e6; at N=5e6, count is 690 (count/sqrt(N) about 0.309). |
| EP-341 | Erdős Problem #341 | to-check | 32 |  | no_background_partial_result | Background reports very long transients before observed periodicity for small seeds. |
| EP-342 | Erdős Problem #342 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-345 | Erdős Problem #345 | to-check | 255 | 1980 | known_initial_thresholds_increasing_reversal_question_open | Background-listed values T(n),T(n^2),...,T(n^5) are strictly increasing, so no early counter-monotone k is known here. |
| EP-346 | Erdős Problem #346 | to-check | 257 | 1980 | fibonacci_model_known_asymptotic_rigidity_open | Background gives Graham’s Fibonacci-derived sequence with required properties and notes irregular examples also exist. |
| EP-348 | Erdős Problem #348 | to-check | 33 |  | small_pairs_known_strong_sense_no_weak_open | Background gives realizable pairs (0,1) and (1,2), and van Doorn's nonexistence for 2<=m<n under strong completeness. |
| EP-349 | Erdős Problem #349 | to-check | 169 | 1964 | complex_parameter_structure_known_full_classification_open | Background reports highly nontrivial disconnected parameter behavior for completeness. |
| EP-351 | Erdős Problem #351 | harder |  | 2019 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-352 | Erdős Problem #352 | harder |  | 2013 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-354 | Erdős Problem #354 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-357 | Erdős Problem #357 | to-check | 288 | 1986 | finite_linear_scale_lower_bounds_found_asymptotic_o_n_open | Found f(40)>=18 (and similarly strong values for n=20..35), indicating robust finite linear-scale behavior. |
| EP-358 | Erdős Problem #358 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-359 | Erdős Problem #359 | to-check | 232 | 1977 | exact_finite_generation_supports_andrews_scale_not_proved | Computed to k=2400 with a_2400=8378; ratio to k log k/log log k stays around 0.88-0.92 on high checkpoints. |
| EP-361 | Erdős Problem #361 | to-check | 34 |  | statement_issue_malformed_dataset_entry | Statement field contains injected garbage fragment and background is empty in current dataset copy. |
| EP-365 | Erdős Problem #365 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-367 | Erdős Problem #367 | to-check | 35 |  | second_stronger_bound_false_first_open | For k>=3, the stronger bound prod_{n<=m<n+k} B_2(m) <<_k n^2 is false; background gives k=3 lower spikes prod_{n<=m<n+3} B_2(m) >> n^2 log n infinitely often. |
| EP-368 | Erdős Problem #368 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-369 | Erdős Problem #369 | to-check | 359 | 1998 | proved_true_as_written_trivial | For n > k^(1/epsilon), every m with 1 <= m <= k has all prime factors <= k < n^epsilon, so this block is n^epsilon-smooth. |
| EP-371 | Erdős Problem #371 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-373 | Erdős Problem #373 | harder |  | 2010 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-374 | Erdős Problem #374 | harder |  | 2014 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-376 | Erdős Problem #376 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-377 | Erdős Problem #377 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-380 | Erdős Problem #380 | to-check | 36 |  | lower_bound_known_equivalence_open | Background gives B(x)>x^{1-o(1)} and an asymptotic for #{n<=x : P(n)^2 divides n}. |
| EP-382 | Erdős Problem #382 | to-check | 37 |  | vhalf_bound_known_subpower_open | Background states v-u<=v^{1/2+o(1)}; Cramer-type conjecture would imply v-u=v^{o(1)}. |
| EP-383 | Erdős Problem #383 | to-check | 38 |  | heuristic_and_finite_evidence_no_infinitude_proof | Computation for p<=50000 found sample witnesses for k=1..5; for k=5 examples include p=15361,43777,44531,45131. |
| EP-385 | Erdős Problem #385 | to-check | 39 |  | equivalent_reformulation_known_questions_open | Background notes first question is equivalent to EP-430. |
| EP-386 | Erdős Problem #386 | to-check | 40 |  | finite_scan_extended_no_new_large_k_hits | Exact scan for 2<=k<=12 and n<=2,000,000 found hits only at (n,k)=(4,2),(6,2),(15,2),(21,2),(715,2),(7,3),(10,4),(14,4),(15,6); no hits for k=5 or k>=7 in range. |
| EP-387 | Erdős Problem #387 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-388 | Erdős Problem #388 | to-check | 41 |  | no_background_partial_result | Background states general finiteness expectation for a broader equation family. |
| EP-389 | Erdős Problem #389 | to-check | 42 |  | finite_range_data_universal_existence_open | Bounded search (n<=30, k<=300) finds witnesses for n=1..5 with k=1,5,4,207,206; none found up to cap for n=6..30. |
| EP-390 | Erdős Problem #390 | to-check | 270 | 1982 | order_known_constant_open | Background gives f(n)-2n asymp n/log n (Erdos-Guy-Selfridge, 1982). |
| EP-393 | Erdős Problem #393 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-394 | Erdős Problem #394 | to-check | 258 | 1980 | o_x2_case_solved_stronger_open | Background: Erdos-Hall proved sum_{n<=x} t_2(n) << x^2*(log log log x)/(log log x), hence sum_{n<=x} t_2(n)=o(x^2). |
| EP-396 | Erdős Problem #396 | harder |  | 2014 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-400 | Erdős Problem #400 | to-check | 43 |  | log_upper_bound_known_constants_open | Background states g_k(n)<<_k log n. |
| EP-404 | Erdős Problem #404 | to-check | 162 | 1960 | specific_case_bound_known_general_classification_open | Background cites f(2,2)<=254. |
| EP-406 | Erdős Problem #406 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-408 | Erdős Problem #408 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-409 | Erdős Problem #409 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-410 | Erdős Problem #410 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-411 | Erdős Problem #411 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-412 | Erdős Problem #412 | to-check | 242 | 1979 | empirical_negative_signal_no_proof | Background reports Selfridge numerical evidence suggesting the answer may be no. |
| EP-413 | Erdős Problem #413 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-414 | Erdős Problem #414 | to-check | 44 |  | no_background_partial_result | Background reports the problem and belief that answer is yes. |
| EP-415 | Erdős Problem #415 | to-check | 144 | 1936 | order_of_growth_known_finer_structure_open | Background states F(n) is of order log log log n. |
| EP-416 | Erdős Problem #416 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-417 | Erdős Problem #417 | to-check | 361 | 1998 | attempted_not_proved_totient_value_ratio_open | formulated key obstacle as asymptotic control of repeat rates among totient values <=x |
| EP-420 | Erdős Problem #420 | to-check | 346 | 1996 | power_scale_growth_known_log_scale_density_questions_open | finite scan shows strong growth for C>=2 at sampled n, while f=floor(log n) profile fluctuates and can stay near 1 |
| EP-421 | Erdős Problem #421 | to-check | 45 |  | density_gt_1_over_e_known_density1_open | Background gives existence for density > 1/e - epsilon for any epsilon>0. |
| EP-422 | Erdős Problem #422 | to-check | 46 |  | finite_prefix_well_defined_global_open | Local computation verifies well-definedness through n=500000 and shows many missed values up to max f(n) on that range. |
| EP-423 | Erdős Problem #423 | to-check | 233 | 1977 | exact_finite_generation_confirms_gap_growth_asymptotic_open | Computed to n=6000 with a_6000=6275, so a_n-n=275 and a_n/n~1.0458 at endpoint. |
| EP-424 | Erdős Problem #424 | to-check | 260 | 1980 | original_stronger_version_false_weaker_open | Background gives a mod-3 invariant excluding all numbers congruent to 1 mod 3, so the stronger "almost all integers" form is false. |
| EP-425 | Erdős Problem #425 | to-check | 262 | 1980 | greedy_lower_bounds_consistent_with_scale_constant_unproved | For n up to 3000, greedy best sizes satisfy \|A\|-pi(n) growing on the expected scale; normalized proxy rises from about 5.5 to 8.5. |
| EP-428 | Erdős Problem #428 | to-check | 47 |  | conditional_limsup_known_liminf_open | Background says assuming prime k-tuple conjecture, statement holds with limsup in place of liminf. |
| EP-430 | Erdős Problem #430 | to-check | 48 |  | equivalent_to_ep385_first_part | Background reports EP-430 first question is equivalent to first part of EP-385. |
| EP-431 | Erdős Problem #431 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-432 | Erdős Problem #432 | to-check | 49 |  | no_background_partial_result | Background gives only attribution to Straus/Ostmann motivation. |
| EP-436 | Erdős Problem #436 | to-check | 316 | 1991 | partially_resolved_not_fully_closed | for p<=20000 (0 included as kth-power residue), observed max r(k,3,p): k=3->281, k=5->3329, k=7->6832, k=9->17189 |
| EP-445 | Erdős Problem #445 | to-check | 370 | 2000 | proved_for_c_gt_three_quarters_lower_threshold_open | sampled scans up to p<=20000 gave near-complete success for c>=0.7 and full success for tested c>=0.75 |
| EP-450 | Erdős Problem #450 | harder |  | 2008 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-451 | Erdős Problem #451 | to-check | 243 | 1979 | finite_exact_values_and_lower_bounds_obtained_asymptotic_open | For k<=80 with cap 1000k, many exact values were found (e.g. n_25=7653, n_32=30783); 49 k-values remained unresolved within cap. |
| EP-452 | Erdős Problem #452 | to-check | 145 | 1937 | density_and_crt_lower_bound_known_extremal_open | Known: density 1/2 and interval length at least (1+o(1)) log x/(log log x)^2 via CRT. |
| EP-454 | Erdős Problem #454 | to-check | 244 | 1979 | finite_record_growth_observed_limsup_unproved | Up to n<=10000, max observed delta reached 38 (at n=9834), with progressively higher threshold hits. |
| EP-455 | Erdős Problem #455 | to-check | 225 | 1976 | greedy_sequences_show_quadratic_scale_no_divergence_proof | With Pmax=10^7 and length 50 search, best found q_50=3491 so q_50/50^2=1.3964. |
| EP-456 | Erdős Problem #456 | to-check | 245 | 1979 | finite_distribution_sample_obtained_almost_all_behavior_open | For 2<=n<=1500, strict m_n<p_n occurs for 358 values (~23.9%); power-of-two odd-exponent samples in range all satisfy strict inequality. |
| EP-457 | Erdős Problem #457 | to-check | 50 |  | two_plus_o1_threshold_known_eps_open | Background provides examples with q(n,log n) >= (2+o(1))log n. |
| EP-460 | Erdős Problem #460 | to-check | 261 | 1980 | finite_greedy_scan_large_reciprocal_sums_asymptotic_divergence_open | In scans up to n=12000, max observed sum_{0<a_i<n}1/a_i is about 3.159 (at n=10343). |
| EP-461 | Erdős Problem #461 | to-check | 51 |  | t_over_log_t_known_linear_open | Background reports f(n,t) >> t/log t. |
| EP-462 | Erdős Problem #462 | to-check | 52 |  | statement_issue_malformed_dataset_entry | Statement field includes injected garbage fragment and background is empty in current dataset copy. |
| EP-463 | Erdős Problem #463 | to-check | 317 | 1992 | heuristic_growth_signal_not_proved | at checkpoints n=5e3..1e6, observed n-F(n)=30,80,122,134,186,658 and positive proxy g(n)=41..733 in finite window |
| EP-467 | Erdős Problem #467 | to-check | 256 | 1980 | statement_issue_malformed_dataset_entry | Background explicitly notes crucial quantifiers are missing and current wording is an interpreted reconstruction. |
| EP-468 | Erdős Problem #468 | to-check | 53 |  | statement_issue_malformed_dataset_entry | Statement field contains injected garbage fragment and background is empty in current dataset copy. |
| EP-469 | Erdős Problem #469 | to-check | 202 | 1974 | exact_finite_scan_series_behavior_not_decisive | Found 541 primitive pseudoperfect numbers up to 120000 with reciprocal partial sum ~0.34048. |
| EP-470 | Erdős Problem #470 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-472 | Erdős Problem #472 | to-check | 54 |  | finite_prefix_growth_no_infinitude_proof | Local computation from seed (3,5) continues to length 400 with no termination in this run. |
| EP-477 | Erdős Problem #477 | to-check | 55 |  | no_background_partial_result | Background reports Erdos-Graham thought the answer should be negative. |
| EP-478 | Erdős Problem #478 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-479 | Erdős Problem #479 | to-check | 56 |  | power2_and_minus1_families_solved_general_open | Background reports proofs for k=2^i (i>=1) and k=-1; local scan to n<=10^6 finds witnesses for many small k. |
| EP-483 | Erdős Problem #483 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-486 | Erdős Problem #486 | to-check | 155 | 1951 | singleton_case_solved_general_case_open | Background: logarithmic density exists when X_n={0} for all n in A. |
| EP-488 | Erdős Problem #488 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-489 | Erdős Problem #489 | to-check | 57 |  | squarefree_case_solved_general_open | Background states Erdos proved the limit exists for A={p^2 : p prime} (squarefree B case). |
| EP-495 | Erdős Problem #495 | to-check | 58 |  | no_background_partial_result | Background labels this as the Littlewood conjecture. |
| EP-500 | Erdős Problem #500 | harder |  | 2010 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-501 | Erdős Problem #501 | to-check | 293 | 1987 | second_subquestion_fully_solved_first_subquestion_open | Closed-case theorem (NPS87) yields an infinite independent set, so the size-3 subquestion is fully solved positive; the unrestricted first question remains unresolved. |
| EP-503 | Erdős Problem #503 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-507 | Erdős Problem #507 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-508 | Erdős Problem #508 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-509 | Erdős Problem #509 | to-check | 206 | 1974 | connected_case_solved_general_open | Background: Cartan gave 2e, Pommerenke improved to 2.59, and proved constant 2 when the set is connected. |
| EP-510 | Erdős Problem #510 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-513 | Erdős Problem #513 | to-check | 171 | 1964 | strict_interval_known_exact_value_open | Background places the value above 1/2 and below a constant strictly less than 2/pi. |
| EP-514 | Erdős Problem #514 | to-check | 59 |  | first_part_solved_quantitative_open | Background reports Boas (unpublished) proved existence of a path with \|f(z)/z^n\|->infinity for every fixed n. |
| EP-517 | Erdős Problem #517 | to-check | 141 | 1929 | strong_sufficient_conditions_known_full_criterion_open | Known results cover cases such as sum 1/n_k<infinity and additional finite-order gap hypotheses. |
| EP-520 | Erdős Problem #520 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-521 | Erdős Problem #521 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-522 | Erdős Problem #522 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-524 | Erdős Problem #524 | to-check | 156 | 1954 | fluctuation_bounds_known_exact_order_open | Background gives infinitely-often small upper behavior and limsup-type lower growth for almost all t. |
| EP-528 | Erdős Problem #528 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-529 | Erdős Problem #529 | harder |  | 2013 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-530 | Erdős Problem #530 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-531 | Erdős Problem #531 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-533 | Erdős Problem #533 | to-check | 167 | 1962 | delta_threshold_partial_results_known_full_range_open | Background: true for delta>1/16; also true for K4-free at any delta>0. |
| EP-535 | Erdős Problem #535 | to-check | 195 | 1970 | exact_small_n_r3_proxy_established_general_problem_open | r=3 proxy maximum on [1,n] computed exactly up to n=50; value at n=50 is 11. |
| EP-536 | Erdős Problem #536 | to-check | 196 | 1970 | exact_small_n_extremal_values_established_asymptotic_open | Exact maxima for 6<=n<=50 computed; ratio at n=50 is 39/50. |
| EP-538 | Erdős Problem #538 | to-check | 60 |  | general_upper_bound_known_optimal_open | Background gives sum_{n in A} 1/n << r*log N/log log N. |
| EP-539 | Erdős Problem #539 | to-check | 61 |  | two_sided_exponent_window_known | Background states n^{1/2} << h(n) << n^{1-c} for some c>0. |
| EP-543 | Erdős Problem #543 | to-check | 173 | 1965 | simulation_supports_small_overhead_not_proof | In tested groups of size 2^d, estimated k50-log2N was about 1 (F2^d) and 2-3 (cyclic-like families). |
| EP-544 | Erdős Problem #544 | to-check | 62 |  | no_background_partial_result | Background identifies this as an ErdH{o}s-SH{o}s problem in the Ramsey collection. |
| EP-545 | Erdős Problem #545 | harder |  | 2011 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-550 | Erdős Problem #550 | to-check | 231 | 1977 | k2_base_case_trivial_general_multipartite_case_open | For k=2 (G=K_{m1,m2}) the stated inequality is tautologically true. |
| EP-552 | Erdős Problem #552 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-554 | Erdős Problem #554 | to-check | 63 |  | no_background_partial_result | Background says the problem is open even for n=2 (i.e., C_5 case). |
| EP-555 | Erdős Problem #555 | to-check | 265 | 1981 | known_exponent_window_no_new_bound_from_search | Random/hill-climb searches gave only small finite lower-bound witnesses and no improvement over known theoretical exponent window. |
| EP-557 | Erdős Problem #557 | to-check | 64 |  | implied_by_ep548_not_closed_here | Background states the claim is implied by [548]. |
| EP-558 | Erdős Problem #558 | to-check | 364 | 1999 | many_parameter_families_solved_full_grid_open | recorded solved asymptotics for K_{2,2}, K_{3,3}, and regimes with large s relative to t |
| EP-560 | Erdős Problem #560 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-561 | Erdős Problem #561 | to-check | 236 | 1978 | single_star_base_case_established_general_union_case_open | Exhaustive checks confirm hatR(K1,a,K1,b)=a+b-1 for tested pairs up to (4,4); for (4,4), lower check shows no host with m<=6 and K1,7 gives upper bound 7. |
| EP-562 | Erdős Problem #562 | to-check | 174 | 1965 | major_open_ramsey_growth_problem | Entry states the target tower-height asymptotic formulation; no full proof cited. |
| EP-563 | Erdős Problem #563 | to-check | 65 |  | order_known_constant_open | Background gives F(n,alpha) asymp_alpha log n for every 0<=alpha<1/2. |
| EP-564 | Erdős Problem #564 | to-check | 282 | 1984 | known_bound_window_double_exponential_lower_bound_open | Background gives 2^{c n^2} < R_3(n) < 2^{2^n}; the asked doubly-exponential lower bound remains unresolved here. |
| EP-566 | Erdős Problem #566 | to-check | 327 | 1993 | degeneracy_reduction_identified_linear_ramsey_size_open | proved reduction of hypothesis to 3-degeneracy and isolated extension gap to linear-in-m Ramsey size |
| EP-567 | Erdős Problem #567 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-568 | Erdős Problem #568 | to-check | 66 |  | no_background_partial_result | Background restates the question as whether G is Ramsey-size linear. |
| EP-569 | Erdős Problem #569 | to-check | 67 |  | no_background_partial_result | Background provides problem statement/collection reference only. |
| EP-571 | Erdős Problem #571 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-572 | Erdős Problem #572 | to-check | 369 | 1999 | k3_k5_solved_general_open | Target bound ex(n;C_{2k})>>n^{1+1/k} is proved for k=3 and k=5 (Benson, per background). |
| EP-573 | Erdős Problem #573 | to-check | 157 | 1954 | stronger_forbidden_family_asymptotic_known_target_open | Background: asymptotic (n/2)^{3/2} known when forbidding C4 and all odd cycles. |
| EP-574 | Erdős Problem #574 | to-check | 68 |  | k2_case_referenced_general_k_open | Background points to [573] for the specific case k=2. |
| EP-575 | Erdős Problem #575 | to-check | 69 |  | no_background_partial_result | Background states problem attribution (Erdos-Simonovits) with no additional result here. |
| EP-576 | Erdős Problem #576 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-579 | Erdős Problem #579 | to-check | 70 |  | delta_gt_1_over_8_solved_general_delta_open | Background states the claim was proved for delta>1/8. |
| EP-584 | Erdős Problem #584 | harder |  | 2008 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-585 | Erdős Problem #585 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-588 | Erdős Problem #588 | harder |  | 2013 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-589 | Erdős Problem #589 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-591 | Erdős Problem #591 | harder |  | 2010 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-592 | Erdős Problem #592 | harder |  | 2010 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-593 | Erdős Problem #593 | to-check | 210 | 1975 | graph_analogue_solved_hypergraph_open | Background states the graph analogue is completely solved at chromatic threshold >=aleph_1. |
| EP-595 | Erdős Problem #595 | to-check | 218 | 1975 | finite_level_unbounded_color_demand_known_countable_union_case_open | Background gives for every n a finite K4-free graph not coverable by n triangle-free subgraphs. |
| EP-596 | Erdős Problem #596 | to-check | 71 |  | existence_known_full_characterization_open | Background gives explicit example G1=C4, G2=C6 and notes original conjecture of nonexistence is false. |
| EP-597 | Erdős Problem #597 | to-check | 72 |  | special_case_solved_general_open | Background states omega_1^2 -> (omega_1 omega,3)^2 and that earlier K4-free-only version is false via K_{aleph0,aleph0}. |
| EP-598 | Erdős Problem #598 | to-check | 73 |  | statement_issue_malformed_dataset_entry | Statement contains injected garbage fragment and background is empty in current copy. |
| EP-600 | Erdős Problem #600 | to-check | 239 | 1978 | constructive_lower_bounds_extended_not_asymptotically_resolved | Examples include e(30,2)>=55 (from feasible tmax=1 graph with 54 edges) and e(30,3)>=146 (from feasible tmax=2 graph with 145 edges). |
| EP-601 | Erdős Problem #601 | to-check | 309 | 1990 | initial_zfc_range_solved_general_open | Background gives truth in ZFC for alpha<omega_1^{omega+2}; under Martin's axiom, true for all alpha<2^{aleph_0}. |
| EP-602 | Erdős Problem #602 | to-check | 74 |  | no_background_partial_result | Background identifies this as Komjath's Property B-type question. |
| EP-603 | Erdős Problem #603 | to-check | 75 |  | intersection1_variant_solved_intersection2_open | Background says Komjath proved countably many colors suffice when \|A_i cap A_j\| != 1. |
| EP-604 | Erdős Problem #604 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-609 | Erdős Problem #609 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-610 | Erdős Problem #610 | to-check | 345 | 1995 | baseline_bound_known_stronger_deficit_open | recorded known general bound tau(G)<=n-sqrt(2n)+O(1) and relation to EP-151 transfer conjecture |
| EP-611 | Erdős Problem #611 | to-check | 318 | 1992 | attempted_not_proved | identified that existing inequalities leave linear-size transversals in the c n clique-size regime |
| EP-612 | Erdős Problem #612 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-614 | Erdős Problem #614 | to-check | 76 |  | statement_issue_malformed_dataset_entry | Statement contains injected garbage fragment and background is empty in current copy. |
| EP-616 | Erdős Problem #616 | to-check | 312 | 1991 | linear_bound_window_known_exact_constant_open | Background bounds give (3/16)r+7/8 <= t <= r/5; exact value remains undetermined. |
| EP-619 | Erdős Problem #619 | to-check | 371 | 2000 | threshold_case_r4_open_between_known_r3_r5_results | recorded known bounds h_3<=n and h_5<=(n-1)/2 with unresolved h_4<(1-c)n question |
| EP-620 | Erdős Problem #620 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-623 | Erdős Problem #623 | to-check | 365 | 1999 | below_threshold_negative_known_threshold_case_open | isolated unresolved case exactly at \|X\|=aleph_omega with prior suggestion of possible undecidability |
| EP-624 | Erdős Problem #624 | to-check | 184 | 1968 | small_n_exact_value_established | Exact value H(8)=4 established in this attempt. |
| EP-625 | Erdős Problem #625 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-626 | Erdős Problem #626 | to-check | 297 | 1988 | log_scale_bounds_known_limit_existence_and_value_open | Known two-sided bounds place g_k(n) on a log n scale and constrain h^{(m)} growth exponents, but do not settle limit existence/value. |
| EP-627 | Erdős Problem #627 | to-check | 183 | 1967 | asymptotic_order_known_limit_existence_open | Background gives f(n) asy n/(log n)^2 and interval constraints for a possible limit value. |
| EP-629 | Erdős Problem #629 | to-check | 373 | 2000 | tight_exponential_bounds_known_exact_asymptotics_open | recorded strongest available sandwich bounds and small-k exact values n(2)=6, n(3)=14 |
| EP-633 | Erdős Problem #633 | harder |  | 2009 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-634 | Erdős Problem #634 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-635 | Erdős Problem #635 | to-check | 77 |  | t1_exact_t2_lower_known_general_open | Background gives exact maximum for t=1 and a t=2 construction with \|A\|>=N/2 + c log N. |
| EP-638 | Erdős Problem #638 | to-check | 78 |  | no_background_partial_result | Background contains only speculative comment from Erdos. |
| EP-640 | Erdős Problem #640 | to-check | 79 |  | statement_issue_malformed_dataset_entry | Statement includes injected garbage fragment and background is empty. |
| EP-642 | Erdős Problem #642 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-643 | Erdős Problem #643 | harder |  | 2009 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-644 | Erdős Problem #644 | to-check | 319 | 1992 | partially_resolved_not_fully_closed | documented exact solved cases f(k,3)=2k, f(k,4)=floor(3k/2), f(k,5)=floor(5k/4), f(k,6)=k |
| EP-650 | Erdős Problem #650 | to-check | 159 | 1959 | sqrt_lower_bound_known_upper_open | Background gives f(m)>>m^{1/2}. |
| EP-652 | Erdős Problem #652 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-653 | Erdős Problem #653 | to-check | 80 |  | two_sided_linear_bounds_near_n_open | Background gives g(n)>(7/10)n and g(n)<n-c n^{2/3} for some c>0. |
| EP-654 | Erdős Problem #654 | to-check | 307 | 1990 | random_generic_support_near_full_distinctness_proof_open | Random scans found best ratios from 0.98 up to about 0.994 for max distinct distances from one point. |
| EP-655 | Erdős Problem #655 | to-check | 81 |  | statement_issue_counterexample_in_background | Background states equally spaced points on a circle disprove the conjecture as written. |
| EP-657 | Erdős Problem #657 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-660 | Erdős Problem #660 | to-check | 219 | 1975 | explicit_convex_families_meet_half_n_scale_universal_bound_open | Explicit antiprisms achieve exactly n/2 distinct distances (tested to n=200); bipyramids stay near 0.5n. |
| EP-661 | Erdős Problem #661 | to-check | 82 |  | r4_benchmark_known_planar_open | Background gives an R^4 construction with d(x_i,y_j)=1 for all i,j. |
| EP-662 | Erdős Problem #662 | to-check | 351 | 1997 | statement_issue_likely_malformed_as_written | flagged as requiring editorial correction; current wording is not mathematically coherent in literal form |
| EP-663 | Erdős Problem #663 | to-check | 83 |  | k_factor_bound_known_sharp_open | Background gives q(n,k)<(1+o(1))k log n. |
| EP-665 | Erdős Problem #665 | to-check | 358 | 1997 | conditional_no_with_unconditional_bounds | Background gives h(n)<<n^{1/2-c} unconditionally, and conditional answer "no" for fixed C under the prime-power conjecture (Shrikhande-Singhi). |
| EP-667 | Erdős Problem #667 | to-check | 84 |  | endpoint_values_known_monotonicity_open | Known: bounds for q=1; c(p,q)=1 at q=binom(p-1,2)+1; upper bound near q=binom(p-1,2). |
| EP-668 | Erdős Problem #668 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-669 | Erdős Problem #669 | to-check | 203 | 1974 | k3_case_solved_general_k_open | Background gives f_3(n)=n^2/6-O(n) and F_3(n)=n^2/6-O(n), settling the k=3 asymptotic scale (limit 1/6). |
| EP-670 | Erdős Problem #670 | to-check | 356 | 1997 | d1_case_solved_general_d_open | Background states Erdos proved the diameter lower bound claim for d=1. |
| EP-671 | Erdős Problem #671 | to-check | 259 | 1980 | known_divergence_obstructions_existential_quantifier_pattern_open | Bernstein/Erdos-Vertesi-type obstructions are known; numerical demos show Lebesgue growth can coexist with convergence for test functions but do not settle the asked existence statements. |
| EP-675 | Erdős Problem #675 | to-check | 85 |  | sieve_sufficient_conditions_known_key_cases_open | Background states squarefree-set translation property and a broader Brun-sieve sufficient condition. |
| EP-676 | Erdős Problem #676 | to-check | 246 | 1979 | large_finite_exception_sets_found_eventual_coverage_unknown | Up to 1e6 with prime condition, 83811 exceptions were found; without primality, up to 2e5 still 1684 exceptions occur. |
| EP-677 | Erdős Problem #677 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-679 | Erdős Problem #679 | to-check | 86 |  | second_stronger_version_disproved_first_open | The +O(1) stronger version is false: for all large n there exists k<n with omega(n-k) >= log k/log log k + c log k/(log log k)^2. |
| EP-680 | Erdős Problem #680 | to-check | 340 | 1995 | strong_finite_positive_signal_asymptotic_proof_open | verified predicate for all 2<=n<=10^6 except 7 values: 3,7,13,23,31,113,115 |
| EP-681 | Erdős Problem #681 | to-check | 87 |  | strong_finite_counterexample_signal_asymptotic_disproof_open | Exact SPF scan for 2<=n<=10^6 found 31,283 failures (no k with n+k composite and lpf(n+k)>k^2), with failures persisting up to n=999,960. |
| EP-683 | Erdős Problem #683 | to-check | 249 | 1979 | finite_positive_exponent_margin_observed_uniform_c_open | For n<=2000, minimum observed c_local in P(C(n,k))>=k^(1+c_local) was about 0.099. |
| EP-684 | Erdős Problem #684 | to-check | 88 |  | qualitative_divergence_known_quantitative_open | Background indicates Mahler implies f(n)->infinity. |
| EP-685 | Erdős Problem #685 | to-check | 89 |  | baseline_known_main_asymptotic_open | Known lower bound > log(binomial(n,k))/log n; asymptotically sharp when k>n^{1-o(1)}. |
| EP-686 | Erdős Problem #686 | to-check | 90 |  | bounded_search_inconclusive | Within tested caps (N<=200, k<=8, n<=20, m<=200), many N are represented and 68 values remain unreached. |
| EP-687 | Erdős Problem #687 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-688 | Erdős Problem #688 | to-check | 91 |  | lower_bound_known_o1_open | Background gives epsilon_n >> (log log log n)/(log log n). |
| EP-689 | Erdős Problem #689 | to-check | 92 |  | no_background_partial_result | Entry provides related variants but no proven partial result for guaranteed double coverage. |
| EP-690 | Erdős Problem #690 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-691 | Erdős Problem #691 | to-check | 347 | 1996 | subclass_threshold_understood_general_characterization_open | block-model finite densities (x=5e5) ranged roughly 0.68-0.90 across tested parameters, illustrating sensitivity to construction choices |
| EP-693 | Erdős Problem #693 | to-check | 93 |  | statement_issue_malformed_dataset_entry | Statement contains trailing injected text and background is empty in this dataset copy. |
| EP-694 | Erdős Problem #694 | to-check | 94 |  | carmichael_implication_known_ratio_growth_open | Background: if a unique-preimage n exists for phi, then infinitely many such n exist. |
| EP-695 | Erdős Problem #695 | harder |  | 2010 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-696 | Erdős Problem #696 | to-check | 95 |  | h_growth_known_H_over_h_open | Background indicates h(n)->infinity for almost all n (with comment proof reference). |
| EP-700 | Erdős Problem #700 | to-check | 96 |  | multi_part_partial_results_known | Known: f(n)<=n/P(n), equality for semiprimes (and n=30), and infinitely many composite n with f(n)>=n^{1/2} (n=p^2). |
| EP-701 | Erdős Problem #701 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-704 | Erdős Problem #704 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-705 | Erdős Problem #705 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-706 | Erdős Problem #706 | to-check | 97 |  | baseline_r1_known_general_r_open | Background gives Hadwiger-Nelson baseline 5<=L(1)<=7. |
| EP-708 | Erdős Problem #708 | to-check | 321 | 1992 | bounded_search_calibrated_known_small_case_global_asymptotic_open | bounded model (max(A)<=14) gives worst minima 2 for n=2 and 3 for n=3; mismatch at n=3 confirms truncation artifact |
| EP-709 | Erdős Problem #709 | to-check | 160 | 1959 | small_n_exact_result_plus_general_open | Established f(2)=1 via uniqueness-of-common-multiple contradiction in any interval of length max(A). |
| EP-710 | Erdős Problem #710 | to-check | 322 | 1992 | exact_small_n_matching_values_added_asymptotic_formula_open | exact values: f(20)=29, f(30)=46, f(40)=60, f(60)=91, f(80)=121, f(100)=161, f(120)=193 |
| EP-711 | Erdős Problem #711 | harder |  | 2026 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-712 | Erdős Problem #712 | to-check | 264 | 1981 | r2_case_solved_higher_r_open | Background records Turan's theorem giving the limit for r=2. |
| EP-713 | Erdős Problem #713 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-714 | Erdős Problem #714 | to-check | 179 | 1966 | r2_r3_known_general_r_open | Background reports conjectured lower bound proven for r=2 and r=3, with matching upper scale known for all r. |
| EP-719 | Erdős Problem #719 | to-check | 98 |  | statement_issue_malformed_dataset_entry | Statement includes injected text fragment and background is empty in this dataset copy. |
| EP-724 | Erdős Problem #724 | to-check | 280 | 1983 | progressive_lower_bounds_known_target_open | Background lists improvements f(n)>>n^{1/91}, then n^{1/17}, then n^{1/14.8}. |
| EP-725 | Erdős Problem #725 | to-check | 154 | 1951 | broad_k_range_asymptotic_known_full_range_open | Background gives asymptotic count for k up to n^{1/3-o(1)} (with earlier smaller-range result). |
| EP-726 | Erdős Problem #726 | to-check | 211 | 1975 | finite_scale_support_for_loglog_growth_constant_unresolved | At n=5000 sum~0.891 versus target (1/2)loglog n~1.071. |
| EP-727 | Erdős Problem #727 | to-check | 222 | 1975 | strong_finite_hits_for_small_k_infinitude_open | Up to n<=700000: hit counts are 7803 (k=2), 631 (k=3), 45 (k=4), 3 (k=5), and 0 for k=6..10. |
| EP-730 | Erdős Problem #730 | to-check | 212 | 1975 | large_scale_exact_consecutive_pairs_evidence_no_infinite_proof | Exact recurrence-based scan to n<=2,500,000 found 25,547 consecutive pairs (n,n+1) with identical prime-support of C(2n,n), density about 1%. |
| EP-731 | Erdős Problem #731 | to-check | 213 | 1975 | finite_data_consistent_with_reported_scale_not_proved | For 1<=n<=5000, least m values computed exactly (no unresolved cases with m<=5000). |
| EP-734 | Erdős Problem #734 | to-check | 266 | 1981 | sqrt_scale_necessity_known_construction_open | Background implies some block size must occur on the order of n^{1/2} times in any pairwise balanced design. |
| EP-738 | Erdős Problem #738 | to-check | 99 |  | statement_issue_malformed_dataset_entry | Statement includes injected text fragment and background is empty in this dataset copy. |
| EP-740 | Erdős Problem #740 | to-check | 343 | 1995 | countable_r3_case_solved_general_open | Background says Rodl proved the statement for m=aleph_0 and r=3. |
| EP-741 | Erdős Problem #741 | to-check | 334 | 1994 | finite_random_partition_signal_positive_general_proof_open | for N=1200 and densities 0.10..0.30, all 30/30 tested instances per density had some partition with both self-sum densities positive |
| EP-749 | Erdős Problem #749 | to-check | 100 |  | dense_sumset_bounded_rep_tradeoff_open | No construction or impossibility proof obtained for lower density(A+A)>=1-epsilon with uniformly bounded r_{A+A}(n). |
| EP-750 | Erdős Problem #750 | to-check | 278 | 1982 | linear_regime_resolved_general_unbounded_f_open | Background indicates the epsilon m case is resolved via known constructions, but the general f(m)->infty formulation is not closed. |
| EP-757 | Erdős Problem #757 | to-check | 341 | 1995 | constant_interval_known_exact_value_open | recorded current best interval 1/2<c<3/5 for guaranteed Sidon-subset fraction |
| EP-761 | Erdős Problem #761 | to-check | 101 |  | implication_relation_known_core_open | Background states a positive answer to the second question would imply the first. |
| EP-766 | Erdős Problem #766 | to-check | 102 |  | boundary_case_bound_known_monotonicity_open | Background gives f(n;k,l)<=floor(n^2/4)+1 at l=floor(k^2/4)+1 (Dirac-Erdos). |
| EP-768 | Erdős Problem #768 | to-check | 103 |  | two_sided_bounds_known_asymptotic_open | Known lower exp(-c sqrt(log N) log log N) and upper exp(-(1+o(1)) sqrt(log N log log N)) bounds. |
| EP-769 | Erdős Problem #769 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-770 | Erdős Problem #770 | to-check | 104 |  | special_cases_known_density_liminf_open | Known: h(n)=n+1 iff n+1 is prime; h(n) is unbounded on odd n. |
| EP-773 | Erdős Problem #773 | to-check | 344 | 1995 | heuristic_growth_profile_between_known_bounds_open | for N up to 2500, best found sizes ranged 38..277 with log-scale exponent about 0.719-0.790 (1200 trials each) |
| EP-774 | Erdős Problem #774 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-776 | Erdős Problem #776 | to-check | 105 |  | eventual_existence_known_threshold_open | Background: for r>1 and sufficiently large n, n-3 sizes are achievable; n-2 is impossible. |
| EP-778 | Erdős Problem #778 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-782 | Erdős Problem #782 | harder |  | 2007 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-783 | Erdős Problem #783 | to-check | 106 |  | statement_issue_malformed_dataset_entry | Statement contains injected text fragment and background is empty in this dataset copy. |
| EP-786 | Erdős Problem #786 | to-check | 175 | 1965 | constructive_finite_progress_asymptotic_question_open | Greedy search found best densities ~0.65 (N=60) up to ~0.70 (N=400). |
| EP-787 | Erdős Problem #787 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-788 | Erdős Problem #788 | to-check | 372 | 2000 | exact_small_n_values_added_asymptotic_bound_open | exact values found: f(5)=3, f(6)=4, f(7)=4, f(8)=5, f(9)=5, f(10)=6 |
| EP-789 | Erdős Problem #789 | to-check | 207 | 1974 | exact_interval_model_bounds_obtained_full_problem_open | Interval model gives bounds <=3 (n=5,6) and <=4 (n=7,8) for chosen M values. |
| EP-790 | Erdős Problem #790 | to-check | 223 | 1975 | interval_model_sublinear_signal_true_l_n_open | In exact interval model tests: l(5)<=3, l(6)<=4, l(7)<=4, l(8)<=4. |
| EP-791 | Erdős Problem #791 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-792 | Erdős Problem #792 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-793 | Erdős Problem #793 | to-check | 191 | 1969 | exact_small_n_values_established_general_asymptotic_open | Computed exact F(n) for 6<=n<=50; in particular F(30)=11 and F(50)=16. |
| EP-796 | Erdős Problem #796 | to-check | 192 | 1969 | statement_text_typo_likely_exact_small_n_values_established | Computed exact g_3(n) for 8<=n<=40; e.g. g_3(30)=25 and g_3(40)=32. |
| EP-802 | Erdős Problem #802 | to-check | 349 | 1996 | special_cases_solved_general_case_open | recorded that target bound is known for r=3 and for stronger locally sparse classes |
| EP-805 | Erdős Problem #805 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-809 | Erdős Problem #809 | to-check | 107 |  | quadratic_scale_known_constant_open | Background states F_k(n)>>n^2. |
| EP-810 | Erdős Problem #810 | to-check | 108 |  | no_background_partial_result | Entry provides problem statement plus cross-reference only; no partial bound cited. |
| EP-811 | Erdős Problem #811 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-812 | Erdős Problem #812 | to-check | 304 | 1989 | linear_and_two_step_bounds_known_one_step_targets_open | Known bounds include R(n+1)-R(n)>=4n-8 and R(n+2)-R(n)>>n^{2-o(1)}, but neither settles the stated one-step questions. |
| EP-813 | Erdős Problem #813 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-817 | Erdős Problem #817 | to-check | 109 |  | near_exponential_lower_bound_known_gap_open | Background gives g_3(n)>>3^n/n^{O(1)}. |
| EP-819 | Erdős Problem #819 | to-check | 313 | 1991 | exact_small_N_values_added_asymptotic_constant_open | Exact computations gave f(25)=15 and f(36)=21 for \|A\|=floor(sqrt(N)). |
| EP-820 | Erdős Problem #820 | to-check | 204 | 1974 | exact_reduction_to_moduli_covering_plus_strong_finite_evidence | Proved exact criterion H(n)=3 iff n avoids all m_p=lcm(ord_p(2),ord_p(3)); conditional infinitude reduces to non-covering of {m_p}. Exact scan to n<=20,000 gives density 0.40375. |
| EP-821 | Erdős Problem #821 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-824 | Erdős Problem #824 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-825 | Erdős Problem #825 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-826 | Erdős Problem #826 | to-check | 110 |  | no_background_partial_result | Background only notes relation as a stronger form of EP-248. |
| EP-827 | Erdős Problem #827 | harder |  | 2015 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-828 | Erdős Problem #828 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-829 | Erdős Problem #829 | harder |  | 2008 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-830 | Erdős Problem #830 | harder |  | 2015 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-831 | Erdős Problem #831 | to-check | 111 |  | statement_issue_malformed_dataset_entry | Statement contains injected text fragment and background is empty in this dataset copy. |
| EP-836 | Erdős Problem #836 | to-check | 214 | 1975 | first_question_disproved_second_open | Alon counterexample gives intersecting 3-chromatic r-uniform hypergraphs with \|V\|=Theta(4^r/sqrt(r)), so O(r^2) fails. |
| EP-837 | Erdős Problem #837 | to-check | 112 |  | A2_classified_A3_open | Background gives A_2={1-1/k: k>=1}. |
| EP-838 | Erdős Problem #838 | to-check | 237 | 1978 | finite_sampling_upper_bounds_obtained_asymptotic_constant_open | For n=10..18, sampled best counts are far below convex-position counts; at n=18: best random 4960, double-chain 3727, convex-position 261972. |
| EP-839 | Erdős Problem #839 | to-check | 328 | 1993 | greedy_sequence_growth_signal_not_proved | for n up to 3000 in greedy model, a_n/n increases from 2.64 to 3.575; reciprocal-prefix/log ratio decreases from 0.646 to 0.489 |
| EP-840 | Erdős Problem #840 | harder |  | 2097 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-846 | Erdős Problem #846 | to-check | 113 |  | no_background_partial_result | Entry provides statement and cross-references only, without a cited partial bound. |
| EP-847 | Erdős Problem #847 | to-check | 114 |  | no_background_partial_result | Entry has statement and references only; no explicit partial theorem cited. |
| EP-849 | Erdős Problem #849 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-850 | Erdős Problem #850 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-851 | Erdős Problem #851 | to-check | 143 | 1934 | positive_density_baseline_known_near_full_open | Romanoff proved numbers of the form 2^k+p have positive lower density. |
| EP-852 | Erdős Problem #852 | to-check | 115 |  | qualitative_growth_known_quantitative_open | Background states Brun sieve implies h(x)->infinity. |
| EP-853 | Erdős Problem #853 | to-check | 284 | 1985 | finite_index_gap_coverage_growth_observed_asymptotic_open | Computed r(10^4)=66, r(10^5)=102, r(10^6)=156 for index-based definition. |
| EP-854 | Erdős Problem #854 | to-check | 116 |  | historical_all_even_subconjecture_formally_disproved_with_dual_certificate | At n_6=30030, exact dual-method verification shows max gap 22 and missing even gap 20, disproving the historical all-even-up-to-max conjecture. Extended scan through k=9 shows mixed pattern (fail at k=6,8; full coverage at k=7,9). |
| EP-856 | Erdős Problem #856 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-857 | Erdős Problem #857 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-858 | Erdős Problem #858 | to-check | 187 | 1968 | asymptotic_o1_known_quantitative_rate_open | Background proves maximum is o(1); finite searches up to N=5000 found values around 0.52-0.56. |
| EP-859 | Erdős Problem #859 | to-check | 193 | 1970 | trivial_lower_bound_and_finite_trend_established | Proved d_t>=1/t; finite scan up to t=200 (N=3e5) gives d_200~0.2309. |
| EP-860 | Erdős Problem #860 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-863 | Erdős Problem #863 | to-check | 117 |  | r1_case_known_r_ge_2_open | Background gives c_1=c_1'=1. |
| EP-864 | Erdős Problem #864 | to-check | 118 |  | lower_bound_matches_scale_upper_open | Background proves \|A\|>=(1+o(1))(2/sqrt(3))N^{1/2}. |
| EP-865 | Erdős Problem #865 | to-check | 215 | 1975 | finite_exact_scan_supports_constant_gap_conjecture_not_proved | Exact search for 8<=N<=40 gives max(\|A\| avoiding)-5N/8 in [0.875,2.25] (N=40: max avoider size 27). |
| EP-866 | Erdős Problem #866 | to-check | 119 |  | many_k_cases_known_full_profile_open | Known: g_3=2, g_4=O(1), g_5~log N, g_6~N^{1/2}, and general upper/lower exponent bounds. |
| EP-869 | Erdős Problem #869 | to-check | 301 | 1988 | general_nonminimal_basis_examples_known_disjoint_order2_union_case_open | Known existence of additive bases without minimal subbases does not directly settle the specific disjoint-order-2 union question. |
| EP-870 | Erdős Problem #870 | to-check | 250 | 1979 | k2_case_solved_general_k_open | Background gives Erdos-Nathanson: for k=2, if 1_A*1_A(n)>(log(4/3))^{-1}*log n eventually, A contains a minimal basis of order 2. |
| EP-872 | Erdős Problem #872 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-873 | Erdős Problem #873 | to-check | 120 |  | k3_scale_known_general_epsilon_k_open | Background gives matching-order upper/lower behavior for k=3: X^{1/3} log X scale. |
| EP-875 | Erdős Problem #875 | to-check | 121 |  | no_background_partial_result | Background mostly states difficulty/context without a proved quantitative bound. |
| EP-876 | Erdős Problem #876 | to-check | 375 | 2000 | finite_prefix_feasible_infinite_statement_open | constructed prefix 4,33,34,36,39,...,68 of length 20 satisfying constraints in search model |
| EP-878 | Erdős Problem #878 | to-check | 281 | 1984 | statement_issue_malformed_dataset_entry_with_partial_background_results | Record text is split mid-sentence; however, background notes partial progress for some subquestions (for example max f(n) along subsequences). |
| EP-879 | Erdős Problem #879 | to-check | 122 |  | strong_bounds_known_strongest_forms_open | Background gives H(n)-n^{3/2-o(1)}<G(n)<H(n), plus k=2 case of second claim. |
| EP-881 | Erdős Problem #881 | to-check | 123 |  | statement_issue_malformed_dataset_entry | Statement contains injected text fragment and background is empty in this dataset copy. |
| EP-883 | Erdős Problem #883 | to-check | 366 | 1999 | second_question_solved_first_open | Second subquestion is true: Sa99 gives a complete (1,ell,ell) with ell>>log n/loglog n for large n, hence any fixed ell is achieved eventually. |
| EP-884 | Erdős Problem #884 | to-check | 124 |  | statement_issue_malformed_dataset_entry | Statement contains injected fragment and background is empty in this dataset copy. |
| EP-885 | Erdős Problem #885 | harder |  | 2019 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-886 | Erdős Problem #886 | to-check | 352 | 1997 | strong_finite_boundedness_signal_uniform_O_epsilon_one_open | up to n=2e6, max observed counts were 10 for epsilon=0.1 and 4 for epsilon=0.2 |
| EP-887 | Erdős Problem #887 | to-check | 353 | 1997 | strong_finite_boundedness_signal_absolute_K_open | up to n=2e6, max observed counts were 1 (C=1), 4 (C=2), and 6 (C=4) |
| EP-888 | Erdős Problem #888 | to-check | 125 |  | upper_lower_bounds_known_sharp_order_open | Known: \|A\|=o(n), and constructions with size about n log log n / log n. |
| EP-889 | Erdős Problem #889 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-890 | Erdős Problem #890 | to-check | 181 | 1967 | large_finite_scans_not_asymptotic_proof | Computed minima and scaled tail maxima up to N=10^7 for k<=6 (and N=2e6 for k<=12). |
| EP-891 | Erdős Problem #891 | to-check | 140 | 1918 | nearby_length_variant_solved_exact_open | Background gives a positive theorem with interval length (prod_{i=1}^{k-1} p_i)*p_{k+1} (Schinzel via Polya). |
| EP-892 | Erdős Problem #892 | to-check | 188 | 1968 | necessary_conditions_known_no_sufficient_characterization | Background lists two classical necessary conditions for b_n. |
| EP-893 | Erdős Problem #893 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-896 | Erdős Problem #896 | to-check | 126 |  | two_sided_bounds_known_asymptotic_open | Known lower ~(1+o(1))N^2/log N and upper N^2/((log N)^delta (log log N)^{3/2}). |
| EP-901 | Erdős Problem #901 | harder |  | 2009 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-902 | Erdős Problem #902 | to-check | 177 | 1965 | small_n_exact_verified_general_asymptotic_open | Exhaustive search: no m=6 tournament works for n=2, while at least one m=7 tournament works. |
| EP-906 | Erdős Problem #906 | to-check | 275 | 1982 | as_written_true_intended_variant_open | Solved as written by f(z)=1 (nonzero entire): f^(m)=0 for all m>=1, so for any infinite n_k the set {z: f^(n_k)(z)=0 for some k} equals C. |
| EP-911 | Erdős Problem #911 | to-check | 127 |  | statement_issue_malformed_dataset_entry | Statement contains injected fragment and background is empty in this dataset copy. |
| EP-912 | Erdős Problem #912 | to-check | 271 | 1982 | order_known_constant_open | Background gives h(n) asymp (n/log n)^{1/2} (Erdos-Selfridge). |
| EP-913 | Erdős Problem #913 | to-check | 128 |  | conditional_prime_pattern_route_only | Background gives a conditional route to infinitely many n if a specific prime pattern is infinite. |
| EP-917 | Erdős Problem #917 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-918 | Erdős Problem #918 | to-check | 189 | 1969 | known_lower_cardinal_constructions_target_cases_open | Background gives finite-k family of constructions at aleph_1-scale plus wording clarification. |
| EP-919 | Erdős Problem #919 | to-check | 190 | 1969 | related_construction_known_stronger_local_condition_open | Background supplies omega_2^2 example with chromatic aleph_2 and smaller subgraphs chromatic <=aleph_1. |
| EP-920 | Erdős Problem #920 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-928 | Erdős Problem #928 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-929 | Erdős Problem #929 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-930 | Erdős Problem #930 | to-check | 216 | 1975 | r2_k4_variable_length_counterexample_found_global_threshold_open | For r=2, variable-length disjoint intervals give a k=4 counterexample: I1=[8,14], I2=[63,66], whose product is a perfect square. In search window N<=1200 with lengths in [k,k+4], no r=2 counterexample found for k=5..12. |
| EP-931 | Erdős Problem #931 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-932 | Erdős Problem #932 | to-check | 129 |  | density_zero_at_least_one_known_infinitely_many_two_open | Known: r with at least one such n has density 0. |
| EP-933 | Erdős Problem #933 | to-check | 227 | 1976 | rigorous_limsup_lower_bound_constant_established | Proved limsup (2^k3^l)/(n log n) >= 3/log 2 using n=2^(3^r) and v3(2^(3^r)+1)=r+1. |
| EP-934 | Erdős Problem #934 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-935 | Erdős Problem #935 | to-check | 228 | 1976 | ell1_subcase_fully_settled | Proved limsup_{n->infty} Q2(n(n+1))/n^2 = 1 by combining trivial upper bound Q2<=n(n+1) with background Mahler lower bound >=1; hence for every eps>0, Q2(n(n+1))<n^(2+eps) eventually. |
| EP-936 | Erdős Problem #936 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-938 | Erdős Problem #938 | to-check | 130 |  | no_background_partial_result | Entry does not cite a partial theorem resolving the consecutive-term AP question. |
| EP-939 | Erdős Problem #939 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-940 | Erdős Problem #940 | to-check | 337 | 1994 | additive_representation_density_problem_open_for_r_ge_3 | no proof of infinitude of nonrepresentable integers or density-zero representation set for general r>=3 |
| EP-942 | Erdős Problem #942 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-943 | Erdős Problem #943 | to-check | 131 |  | statement_issue_malformed_dataset_entry | Statement contains injected fragment and background is empty in this dataset copy. |
| EP-944 | Erdős Problem #944 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-945 | Erdős Problem #945 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-948 | Erdős Problem #948 | to-check | 132 |  | stronger_monochromatic_version_false_weaker_open | Background reports Galvin counterexample to always obtaining monochromatic finite-sums set. |
| EP-949 | Erdős Problem #949 | to-check | 133 |  | sidon_variant_solved_general_open | Background reports a positive proof for Sidon S: there exists continuum-sized A in R\S with A+A subseteq R\S. |
| EP-950 | Erdős Problem #950 | to-check | 134 |  | moment_estimates_known_pointwise_open | Known: sum_{n<x}f(n)~x and sum_{n<x}f(n)^2~x. |
| EP-951 | Erdős Problem #951 | to-check | 135 |  | integer_subcase_proved_dense_real_counterexample_search_negative | Proved count{a_i<=x}<=pi(x) in the integer-valued subcase via Z-linear independence of prime-exponent vectors. Finite dense-real search (177 families, x in {30,40,50}, product bound 20000) found 0 truncated-condition passes. |
| EP-952 | Erdős Problem #952 | to-check | 234 | 1977 | finite_window_threshold_theorem_established | In box [-220,220]^2, Gaussian-prime connectivity from smallest-norm start fails to reach boundary for D=3 but reaches boundary for each tested D>=4. |
| EP-953 | Erdős Problem #953 | to-check | 235 | 1977 | bounds_gap_identified_no_sharp_asymptotic | Background-level information gives only coarse upper O(r) and weaker constructive lower-growth signals. |
| EP-954 | Erdős Problem #954 | to-check | 136 |  | baseline_lower_bound_known_upper_asymptotic_open | By construction, number of solutions to a_i+a_j<=x is always at least x. |
| EP-955 | Erdős Problem #955 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-956 | Erdős Problem #956 | to-check | 306 | 1990 | linear_translate_construction_profile_observed_superlinear_open | Triangular-lattice disk-translate constructions produced about 2.2n to 2.8n unit-distance pairs in tested sizes. |
| EP-959 | Erdős Problem #959 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-960 | Erdős Problem #960 | to-check | 137 |  | quadratic_upper_bound_known_subquadratic_open | Background gives f_{r,k}(n)<= (1-1/(r-1)) n^2/2 + 1. |
| EP-961 | Erdős Problem #961 | to-check | 208 | 1974 | finite_lower_bounds_computed_asymptotic_unknown | Up to X=6e6: f(100)>=14, f(500)>=20, f(1000)>=34 from observed runs. |
| EP-962 | Erdős Problem #962 | to-check | 176 | 1965 | computational_growth_signal_not_asymptotic_proof | Search to n=10^6 found best k=121; observed k/sqrt(n) decreases across sampled scales. |
| EP-963 | Erdős Problem #963 | to-check | 138 |  | log3_lower_bound_known_log2_target_open | Background records f(n)>=floor(log_3 n). |
| EP-968 | Erdős Problem #968 | to-check | 164 | 1961 | empirical_support_not_proof | In computation up to n=999999, increase frequency is ~0.406 and decrease ~0.594. |
| EP-969 | Erdős Problem #969 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-970 | Erdős Problem #970 | harder |  | 2018 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-971 | Erdős Problem #971 | to-check | 151 | 1949 | infinite_d_case_known_uniform_all_large_d_open | Background: statement holds for an infinite sequence of d; also many residues can have very small least prime. |
| EP-972 | Erdős Problem #972 | to-check | 148 | 1948 | related_distribution_known_target_open | Background records uniform distribution of {p alpha} and consequent infinitude of primes in Beatty sequences. |
| EP-973 | Erdős Problem #973 | to-check | 323 | 1992 | heuristic_search_no_exponential_smallness_found_open | for n=8,12,16,20 best maxima were 0.974,1.416,2.142,3.057 respectively (1200 restarts each) |
| EP-975 | Erdős Problem #975 | to-check | 368 | 1999 | quadratic_case_solved_general_open | Asymptotic c(f)XlogX is known for irreducible quadratic f (Hooley), with explicit constants in several families; general irreducible case remains open in this record. |
| EP-976 | Erdős Problem #976 | to-check | 308 | 1990 | subexp_lower_bound_known_power_gain_targets_open | Background records F_f(n)>>n*exp((log n)^c); finite quadratic scans show large values but do not prove n^{1+c} or n^d lower bounds. |
| EP-978 | Erdős Problem #978 | harder |  | 2011 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-979 | Erdős Problem #979 | to-check | 146 | 1937 | k2_k3_solved_general_k_open | Background states Erdos proved limsup f_k(n)=infinity for k=2 and also for k=3 (noted unpublished there). |
| EP-983 | Erdős Problem #983 | to-check | 194 | 1970 | exact_small_n_f_values_established_asymptotic_open | For 8<=n<=24 exact f(pi(n)+1,n) computed; 2pi(sqrt n)-f equals -1 at n=22,23,24. |
| EP-985 | Erdős Problem #985 | to-check | 287 | 1986 | no_counterexample_in_30m_prime_scan_global_question_open | Extended exact scan to all primes p<=30,000,000 (1,857,857 primes tested): every tested p had at least one prime primitive root q<p. |
| EP-986 | Erdős Problem #986 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-987 | Erdős Problem #987 | to-check | 209 | 1974 | finite_model_diversity_observed_general_asymptotic_open | Arithmetic model shows very small tail A_k/k; quadratic model shows much larger spikes in tested range. |
| EP-990 | Erdős Problem #990 | to-check | 152 | 1950 | degree_bound_known_sparsity_refinement_open | Background says bound is known with d replacing n. |
| EP-992 | Erdős Problem #992 | to-check | 153 | 1950 | general_bounds_improved_target_log_refinement_open | Known general bound improved to N^{1/2}(log N)^{3/2+o(1)}; stronger loglog-scale bounds for lacunary sequences. |
| EP-995 | Erdős Problem #995 | to-check | 172 | 1964 | broader_heavy_step_scan_no_counterexample_signal | Exact-modular scan over bases b in {2,3} and heavy-step mean-zero L2 functions (M in {4,8,16,32}) found no growth counterexample signal; max observed \|S_N\|/(N*sqrt(loglog N)) was 0.1799 and decreased at larger N in tested configurations. |
| EP-996 | Erdős Problem #996 | to-check | 180 | 1966 | known_sufficient_conditions_plus_empirical_support | Background shows progressively weaker sufficient Fourier-tail conditions; simulation for n_k=2^k step-function model shows \|average\| decays with N. |
| EP-997 | Erdős Problem #997 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1002 | Erdős Problem #1002 | to-check | 163 | 1960 | resolved_in_background_as_written | Kesten's distribution theorem for f(alpha,beta,n) implies the stated case by setting beta=0. |
| EP-1003 | Erdős Problem #1003 | to-check | 291 | 1987 | many_finite_equal_totient_pairs_found_infinitude_open | Found 108 solutions n<=5e6 to phi(n)=phi(n+1). |
| EP-1004 | Erdős Problem #1004 | to-check | 289 | 1987 | long_distinct_phi_runs_observed_full_forall_c_asymptotic_open | Best run length reached 271 by x=4e6, exceeding (log x)^c for tested c up to 2. |
| EP-1005 | Erdős Problem #1005 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1011 | Erdős Problem #1011 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1013 | Erdős Problem #1013 | to-check | 185 | 1968 | k2logk_scale_known_finer_limits_open | Background provides two-sided bounds of order k^2 log k. |
| EP-1014 | Erdős Problem #1014 | to-check | 139 |  | open_even_for_k3 | Entry explicitly says the limit statement is open even for k=3. |
| EP-1016 | Erdős Problem #1016 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1017 | Erdős Problem #1017 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1021 | Erdős Problem #1021 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1022 | Erdős Problem #1022 | to-check | 186 | 1968 | t2_solved_higher_t_asymptotic_open_with_finite_evidence | Random search (n=9,t=3) found non-property-B families with max_X e(X)/\|X\| about 1.222. |
| EP-1029 | Erdős Problem #1029 | to-check | 332 | 1993 | normalization_divergence_claim_open_constant_factor_bounds_only | documented that known lower bounds stay on k*2^(k/2) scale up to constants, short of proving ratio->infinity |
| EP-1030 | Erdős Problem #1030 | to-check | 305 | 1989 | linear_gap_bounds_known_ratio_gap_open | Background gives R(k+1,k)-R(k,k)>=2k-5, far from proving a fixed multiplicative ratio gap. |
| EP-1032 | Erdős Problem #1032 | to-check | 330 | 1993 | known_n_to_one_third_constructions_linear_min_degree_open | recorded best known construction scale (~n^(1/3)) versus target omega(n) minimum degree in 4-critical graphs |
| EP-1033 | Erdős Problem #1033 | to-check | 298 | 1988 | bound_window_known_finite_upper_profile_search_no_asymptotic_closure | Local search on n=24..48 found best max-triangle-degree-sum ratios about 1.60n, above 2(sqrt(3)-1)n in sampled sizes. |
| EP-1035 | Erdős Problem #1035 | to-check | 329 | 1993 | dense_host_spanning_cube_threshold_open | identified embedding-threshold formulation and separation from standard dense non-spanning embedding tools |
| EP-1038 | Erdős Problem #1038 | to-check | 165 | 1961 | supremum_known_infimum_bounded_open | Background summary gives sup=2*sqrt(2) and nontrivial bounds on infimum. |
| EP-1039 | Erdős Problem #1039 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1040 | Erdős Problem #1040 | to-check | 201 | 1973 | special_case_model_support_general_problem_open | Monte Carlo area estimates for \|z^m-1\|<1 drop from ~1.324 (m=40) to ~0.344 (m=300). |
| EP-1049 | Erdős Problem #1049 | to-check | 149 | 1948 | integer_t_case_solved_rational_open | Background gives Erdos' theorem: irrationality holds for every integer t>=2. |
| EP-1051 | Erdős Problem #1051 | to-check | 299 | 1988 | rapid_growth_case_known_weaker_liminf_case_open | Background indicates irrationality under sufficiently rapid growth, but not yet under the stated liminf a_n^{1/2^n}>1 condition. |
| EP-1052 | Erdős Problem #1052 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1053 | Erdős Problem #1053 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1054 | Erdős Problem #1054 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1055 | Erdős Problem #1055 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1056 | Erdős Problem #1056 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1057 | Erdős Problem #1057 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1059 | Erdős Problem #1059 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1060 | Erdős Problem #1060 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1061 | Erdős Problem #1061 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1062 | Erdős Problem #1062 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1063 | Erdős Problem #1063 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1065 | Erdős Problem #1065 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1066 | Erdős Problem #1066 | harder |  | 2002 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1068 | Erdős Problem #1068 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1070 | Erdős Problem #1070 | harder |  | 2023 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1071 | Erdős Problem #1071 | to-check | 290 | 1987 | first_subquestion_solved_second_subquestion_open | Finite maximal disjoint unit-segment family in the unit square exists; countably infinite maximal-family variant remains open here. |
| EP-1072 | Erdős Problem #1072 | harder |  | 2002 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1073 | Erdős Problem #1073 | harder |  | 2002 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1074 | Erdős Problem #1074 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1075 | Erdős Problem #1075 | to-check | 170 | 1964 | dense_regime_rminusr_solved_sharper_open | Background gives Erdos' result with c_r=r^{-r} under at least eps*n^r edges. |
| EP-1083 | Erdős Problem #1083 | harder |  | 2008 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1084 | Erdős Problem #1084 | harder |  | 2013 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1085 | Erdős Problem #1085 | harder |  | 2009 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1086 | Erdős Problem #1086 | harder |  | 2017 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1087 | Erdős Problem #1087 | to-check | 198 | 1971 | typical_case_zero_signal_found_extremal_question_open | In 80 random trials per n (n=12..32), min/avg/max degenerate quadruples were all zero. |
| EP-1088 | Erdős Problem #1088 | to-check | 220 | 1975 | cross_polytope_lower_bound_for_n3_established_higher_n_open | Constructed 2d-point sets in R^d with only two distances and no scalene triple, yielding f_d(3)>=2d+1. |
| EP-1089 | Erdős Problem #1089 | to-check | 221 | 1975 | cross_polytope_lower_bound_for_n3_established_asymptotic_open | Cross-polytope gives g_d(3)>=2d+1 via an explicit 2-distance set of size 2d. |
| EP-1091 | Erdős Problem #1091 | to-check | 276 | 1982 | first_question_solved_second_open | First subquestion is yes (Voss, 1982) for K4-free 4-chromatic graphs: an odd cycle with at least two diagonals exists. |
| EP-1092 | Erdős Problem #1092 | to-check | 272 | 1982 | first_question_false_general_open | First subquestion is false: background reports R"odl (1982) gives a counterexample, so f_2(n) is not >> n. |
| EP-1093 | Erdős Problem #1093 | to-check | 331 | 1993 | finite_scan_supports_rarity_of_deficiency_gt1_global_question_open | for n<=30000, k<=60: deficiency counts were 0:32393, 1:50, 2:7, 3:6, 4:1, 9:1 among 32458 defined cases |
| EP-1094 | Erdős Problem #1094 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1095 | Erdős Problem #1095 | harder |  | 2020 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1096 | Erdős Problem #1096 | to-check | 348 | 1996 | pisot_related_partial_characterizations_known_gap_decay_question_open | for m=18 and tested q, tail average gaps were small while occasional O(1) gaps remained in finite truncations |
| EP-1097 | Erdős Problem #1097 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1100 | Erdős Problem #1100 | to-check | 268 | 1981 | finite_tau_perp_and_gk_growth_profile_observed_asymptotics_open | Scan found tail mean tau_perp/omega about 1.214 and squarefree bounds g(1..6)>=1,2,4,7,13,20. |
| EP-1101 | Erdős Problem #1101 | to-check | 267 | 1981 | candidate_sequence_scans_not_decisive_for_goodness | For tested prime-power families up to x=4e5, observed max-gap normalization exceeded 1 at sampled points. |
| EP-1103 | Erdős Problem #1103 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1104 | Erdős Problem #1104 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1105 | Erdős Problem #1105 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1106 | Erdős Problem #1106 | to-check | 374 | 2000 | first_question_resolved_second_open | recorded established F(n)->infinity and known quantitative lower bound F(n)>>log n |
| EP-1107 | Erdős Problem #1107 | to-check | 294 | 1988 | weaker_unconditional_waring_bound_proved_sharp_rplus1_open | Using Hilbert-Waring, every positive integer is a sum of at most W(r)=g(r) many r-powerful numbers for each fixed r>=2; exact scans to n=1e8 additionally show strong finite eventual-coverage signals for r=3..7. |
| EP-1108 | Erdős Problem #1108 | to-check | 314 | 1991 | finite_prefix_evidence_and_fixed_r_partial_theory_global_finiteness_open | scanned subset sums from {1!,...,10!}: found 22 powerful and 17 perfect-power values in finite prefix; this confirms only local abundance/rarity patterns |
| EP-1109 | Erdős Problem #1109 | harder |  | 2004 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1110 | Erdős Problem #1110 | harder |  | 2025 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1111 | Erdős Problem #1111 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1112 | Erdős Problem #1112 | harder |  | 2021 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1113 | Erdős Problem #1113 | harder |  | 2008 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1117 | Erdős Problem #1117 | harder |  | 2024 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1120 | Erdős Problem #1120 | to-check | 205 | 1974 | random_model_probe_not_extremal_proof | For degrees 2..12 (120 trials each), all sampled shortest-path proxies stayed near ~1.02. |
| EP-1122 | Erdős Problem #1122 | harder |  | 2022 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1129 | Erdős Problem #1129 | harder |  | 2015 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |
| EP-1130 | Erdős Problem #1130 | to-check | 240 | 1978 | resolved_in_background_with_explicit_log_bound | As written, the O(log n) claim is true from cited results; maximizing-node characterization is also reported proved in background. |
| EP-1131 | Erdős Problem #1131 | to-check | 336 | 1994 | two_sided_near_one_over_n_bounds_known_constant_open | documented bounds 2-O((log n)^2/n)<=min I<=2-2/(2n-1) |
| EP-1132 | Erdős Problem #1132 | to-check | 166 | 1961 | finite_case_and_density_results_known_full_limsup_open | Background includes Erdos fixed-n max bound and Bernstein density statement. |
| EP-1133 | Erdős Problem #1133 | to-check | 182 | 1967 | finite_node_geometry_split_observed_no_global_counterexample | Subset-fit scan (n=28, epsilon=0.25) found strong node-geometry split: Chebyshev nodes had many low-norm sampled near-full fits (median min-sup ~2.34), while equispaced nodes were mostly high-norm (median ~64.4). |
| EP-1135 | Erdős Problem #1135 | harder |  | 2016 | deprioritized_post2000_refs | Triaged as harder due to reference activity after 2000. |

</details>
