package com.seangpengny.my_todo_app.api.auth.service;

import com.seangpengny.my_todo_app.api.auth.db.AuthMapper;
import com.seangpengny.my_todo_app.api.auth.web.dto.AuthDto;
import com.seangpengny.my_todo_app.api.auth.web.dto.LoginDto;
import com.seangpengny.my_todo_app.api.auth.web.dto.RefreshTokenDto;
import com.seangpengny.my_todo_app.api.auth.web.dto.RegisterDto;
import com.seangpengny.my_todo_app.api.user.User;
import com.seangpengny.my_todo_app.api.user.mapstruct.UserMapstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService{
    private final UserMapstruct userMapstruct;
    private final AuthMapper authMapper;
    private final PasswordEncoder encoder;
    private final DaoAuthenticationProvider daoAuthenticationProvider;
    private final JwtAuthenticationProvider jwtAuthenticationProvider;
    private final JwtEncoder jwtEncoder;

    private JwtEncoder jwtEncoderRefresh;
    @Autowired
    public void jwtEncoderRefresh(@Qualifier("jwtRefreshTokenEncoder") JwtEncoder jwtEncoder) {
        this.jwtEncoderRefresh = jwtEncoder;
    }

    @Override
    @Transactional
    public void register(RegisterDto registerDto) {
        User user = userMapstruct.registerDtoToUser(registerDto);
        log.info("User register information ==>{}", user.toString());
        user.setPassword(encoder.encode(user.getPassword()));
        var isRegistered =authMapper.register(user);
        log.info("isRegistered ==>{}", isRegistered);

        if(isRegistered){
            for(Integer role : registerDto.roles()){
                log.info("user.getId() ==>{}", user.getId());
                log.info("user role ==>{}", role);

                authMapper.createUserRoles(user.getId(),role);
            }
        }

    }

    @Override
    public AuthDto login(LoginDto loginDto) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(loginDto.username(),loginDto.password());
        authentication = daoAuthenticationProvider.authenticate(authentication);
        log.info("Authentication:{}",authentication);

        //create time now
        Instant now = Instant.now();

        //Define scope
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet jwtAccessTokenClaimsSet = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .subject(authentication.getName())
                .expiresAt(now.plus(1, ChronoUnit.MINUTES))
                .claim("scope",scope)
                .build();

        JwtClaimsSet jwtRefreshTokenClaimsSet = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .subject(authentication.getName())
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .claim("scope",scope)
                .build();

        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(jwtAccessTokenClaimsSet)).getTokenValue();
        String refreshToken = jwtEncoderRefresh.encode(JwtEncoderParameters.from(jwtRefreshTokenClaimsSet)).getTokenValue();

        return new AuthDto("Bearer",accessToken,refreshToken);
    }

    @Override
    public AuthDto refreshToken(RefreshTokenDto token) {
        Authentication authentication = new BearerTokenAuthenticationToken(token.refreshToken());
        authentication = jwtAuthenticationProvider.authenticate(authentication);
        log.info("Authentication with refresh token ===>: {}",authentication);
        Jwt jwt = (Jwt) authentication.getCredentials();
        //create time now
        Instant now = Instant.now();

        //Define scope
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet jwtAccessTokenClaimsSet = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .subject(jwt.getSubject())
                .expiresAt(now.plus(1, ChronoUnit.MINUTES))
                .claim("scope",jwt.getClaimAsString("scope"))
                .build();

        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(jwtAccessTokenClaimsSet)).getTokenValue();

        return new AuthDto("Bearer",accessToken,token.refreshToken());
    }
}
