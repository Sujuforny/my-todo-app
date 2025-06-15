package com.seangpengny.my_todo_app.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.seangpengny.my_todo_app.util.KeyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder encoder;
    private final KeyUtil keyUtil;

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider () {
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userDetailsService);
        auth.setPasswordEncoder(encoder);
        return auth;
    }

    @Bean
    public JwtAuthenticationProvider jwtAuthenticationProvider() throws JOSEException {

        JwtAuthenticationProvider provider = new JwtAuthenticationProvider(jwtRefreshTokenDecoder());
        provider.setJwtAuthenticationConverter(new JwtAuthenticationConverter());

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService, PasswordEncoder encoder) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(daoAuthenticationProvider())
                .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> {

//                    request.requestMatchers("/api/v1/auth/register").permitAll();
//                    request.requestMatchers("/api/v1/auth/refresh-token").permitAll();
                    request.requestMatchers("/api/v1/info").hasAnyAuthority("SCOPE_ROLE_User","SCOPE_ROLE_Admin","SCOPE_ROLE_Moderator");//ROLE_Admin, ROLE_User, ROLE_Moderator
                    request.anyRequest().permitAll();
                })
//                .httpBasic(Customizer.withDefaults());
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }


    // ╔══════════════════════════════════════════════╗
    // ║              JWT Configuration               ║
    // ╚══════════════════════════════════════════════╝
    /**
     * Configures a JwtDecoder bean using the public part of the RSA key.
     * This will be used to verify the JWT signatures in incoming requests.
     */
    @Bean
    @Primary
    public JwtDecoder jwtAccessTokenDecoder() throws JOSEException {
        return NimbusJwtDecoder.withPublicKey(keyUtil.getAccessTokenPublicKey()).build();
    }

    @Bean(name="jwtRefreshTokenDecoder")
    public JwtDecoder jwtRefreshTokenDecoder() throws JOSEException {
        return NimbusJwtDecoder.withPublicKey(keyUtil.getRefreshTokenPublicKey()).build();
    }

    /**
     * Configures a JwtEncoder bean using the JWKSource.
     * This will be used to sign JWTs using the private RSA key when issuing tokens.
     */
    @Bean
    @Primary
    public JwtEncoder jwtAccessTokenEncoder() {

        JWK jwk = new RSAKey.Builder(keyUtil.getAccessTokenPublicKey())
                .privateKey(keyUtil.getAccessTokenPrivateKey())
                .build();
        JWKSet jwkSet = new JWKSet(jwk);
        return new NimbusJwtEncoder(((jwkSelector, securityContext)
                -> jwkSelector.select(jwkSet))
        );
    }
    @Bean
    @Qualifier("jwtRefreshTokenEncoder")
    public JwtEncoder jwtRefreshTokenEncoder() {

        JWK jwk = new RSAKey.Builder(keyUtil.getRefreshTokenPublicKey())
                .privateKey(keyUtil.getRefreshTokenPrivateKey())
                .build();
        JWKSet jwkSet = new JWKSet(jwk);
        return new NimbusJwtEncoder(((jwkSelector, securityContext)
                -> jwkSelector.select(jwkSet))
        );
    }

}
